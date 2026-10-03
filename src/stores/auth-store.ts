import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PublicUser, User } from "@/types/user";

/**
 * SECURITY: `mockDigest` is **not** a password hash and this is not security.
 * It is 32-bit FNV-1a — eight hex characters, chosen because it is short,
 * collides trivially, and looks nothing like bcrypt, so no later session can
 * mistake it for credential storage. 32 bits is brute-forceable in
 * microseconds, so it protects nothing; it exists for one reason only, which is
 * to keep plaintext passwords out of `localStorage`. Real credential storage
 * belongs on a server, with a real KDF.
 */
function mockDigest(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let hash = 0x811c9dc5;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * The shared throwaway password behind both seeded accounts. Eight characters
 * with a letter and a number, so it satisfies the real `passwordSchema` and is
 * obviously not a credential. A real deployment must never seed an account.
 */
const SEED_PASSWORD = "demo1234";

/** D-8: 16 hex characters, valid for 15 minutes. */
const RESET_TOKEN_BYTES = 8;
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

export type PendingReset = {
  token: string;
  email: string;
  /** ISO datetime. */
  expiresAt: string;
};

type AuthState = {
  users: User[];
  /** `null` is signed out. Resolved to a `PublicUser` for the UI. */
  sessionUserId: string | null;
  /**
   * A single record, not a map: two concurrent resets overwrite each other.
   * Acceptable for a mock and recorded rather than hidden.
   */
  pendingReset: PendingReset | null;
};

const SEED_USERS: User[] = [
  {
    id: "seed-owner",
    email: "owner@meeplespace.dev",
    firstName: "Ada",
    lastName: "Meeple",
    // The only seeded account carrying the optionals, so the `null` branches in
    // the read-out are exercised by the other account rather than theoretical.
    dateOfBirth: "1990-09-26",
    phone: "0901234567",
    passwordDigest: mockDigest(SEED_PASSWORD),
    role: "admin",
    avatarUrl: null,
    createdAt: "2026-01-05T09:00:00.000Z",
  },
  {
    id: "seed-customer",
    email: "hello@meeplespace.dev",
    firstName: "Bo",
    lastName: "Nguyen",
    dateOfBirth: null,
    phone: null,
    passwordDigest: mockDigest(SEED_PASSWORD),
    role: "customer",
    avatarUrl: null,
    createdAt: "2026-01-05T09:05:00.000Z",
  },
];

/** The fixed account the Google simulation signs in as. Never accumulates. */
const GOOGLE_MOCK_EMAIL = "google.mock@meeplespace.dev";

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Optional fields are `null` when absent, never `""` — that is what makes the field mean "absent". */
function emptyToNull(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/**
 * An explicit allowlist rather than `Omit<User, "passwordDigest">` applied by
 * destructuring: a field added to `User` later is a type error here instead of
 * silently leaking into the UI until someone notices the digest.
 */
function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    phone: user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

/**
 * Adds any seed whose email is not already present, and never overwrites a
 * matching record. Without this, `persist`'s merge would replace the whole
 * `users` array with whatever was stored, so a developer who registered an
 * account and later cleared one seed would lose their own record.
 */
function withSeededUsers(users: User[]): User[] {
  const present = new Set(users.map((user) => user.email));
  const missing = SEED_USERS.filter((seed) => !present.has(seed.email));
  return missing.length === 0 ? users : [...users, ...missing];
}

function createSeedState(): AuthState {
  return { users: SEED_USERS, sessionUserId: null, pendingReset: null };
}

function mintResetToken(): string {
  const bytes = new Uint8Array(RESET_TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

type AuthActions = {
  register: (input: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    dateOfBirth?: string | null;
    phone?: string | null;
  }) => PublicUser;
  signIn: (email: string, password: string) => PublicUser | null;
  signOut: () => void;
  signInWithGoogle: () => PublicUser;
  beginPasswordReset: (email: string) => string;
  completePasswordReset: (token: string, newPassword: string) => boolean;
  findByEmail: (email: string) => PublicUser | undefined;
  getSessionUser: () => PublicUser | null;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...createSeedState(),

      register: (input) => {
        const user: User = {
          id: crypto.randomUUID(),
          email: normaliseEmail(input.email),
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          dateOfBirth: emptyToNull(input.dateOfBirth),
          phone: emptyToNull(input.phone),
          passwordDigest: mockDigest(input.password),
          role: "customer",
          avatarUrl: null,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ users: [...state.users, user] }));
        return toPublicUser(user);
      },

      signIn: (email, password) => {
        // The digest is computed for every attempt, known address or not, so the
        // two failure paths cost the same. Byte-identical copy in the caller is
        // the other half of this; perfect timing parity is not reachable in JS.
        const digest = mockDigest(password);
        const user = get().users.find(
          (candidate) => candidate.email === normaliseEmail(email),
        );
        if (user === undefined || user.passwordDigest !== digest) return null;
        set({ sessionUserId: user.id });
        return toPublicUser(user);
      },

      // Clears the session and nothing else. `users` is untouched, so signing
      // back in finds the same account.
      signOut: () => set({ sessionUserId: null }),

      signInWithGoogle: () => {
        const existing = get().users.find(
          (user) => user.email === GOOGLE_MOCK_EMAIL,
        );
        const user: User = existing ?? {
          id: crypto.randomUUID(),
          email: GOOGLE_MOCK_EMAIL,
          firstName: "Google",
          lastName: "Demo",
          dateOfBirth: null,
          phone: null,
          // No password login exists for this account; the digest is a marker,
          // not a credential anybody types.
          passwordDigest: mockDigest("google-sign-in"),
          role: "customer",
          avatarUrl: null,
          createdAt: new Date().toISOString(),
        };
        if (existing === undefined) {
          set((state) => ({ users: [...state.users, user] }));
        }
        set({ sessionUserId: user.id });
        return toPublicUser(user);
      },

      // Mints for **any** well-formed address, including one with no account. A
      // response that differed would be an account-existence oracle, and there
      // is no inbox to deliver a token to anyway, so the caller navigates with
      // the token in the URL instead.
      beginPasswordReset: (email) => {
        const token = mintResetToken();
        set({
          pendingReset: {
            token,
            email: normaliseEmail(email),
            expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString(),
          },
        });
        return token;
      },

      completePasswordReset: (token, newPassword) => {
        const { pendingReset } = get();
        if (pendingReset === null) return false;
        if (pendingReset.token !== token) return false;
        if (Date.parse(pendingReset.expiresAt) <= Date.now()) {
          set({ pendingReset: null });
          return false;
        }
        const digest = mockDigest(newPassword);
        set((state) => ({
          users: state.users.map((user) =>
            user.email === pendingReset.email
              ? { ...user, passwordDigest: digest }
              : user,
          ),
          // Cleared on success so the same token cannot be replayed.
          pendingReset: null,
        }));
        return true;
      },

      findByEmail: (email) => {
        const user = get().users.find(
          (candidate) => candidate.email === normaliseEmail(email),
        );
        return user === undefined ? undefined : toPublicUser(user);
      },

      getSessionUser: () => {
        const { sessionUserId, users } = get();
        if (sessionUserId === null) return null;
        const user = users.find((candidate) => candidate.id === sessionUserId);
        return user === undefined ? null : toPublicUser(user);
      },
    }),
    {
      name: "meeple-space-auth",
      // 1 is the first persisted shape. Bump it and keep the old body as a case
      // in `migrate` when the shape changes again, so a payload from an older
      // build resets to seed instead of throwing on a missing field.
      version: 1,
      migrate: () => createSeedState(),
      storage: createJSONStorage(() => localStorage),
      // `createJSONStorage` returns `undefined` when the getter throws — which
      // it does on the server, where `localStorage` is not defined — and
      // `persistImpl` then falls back to memory with a console warning, so no
      // crash and no wrapper is needed. The one gap it does not cover is a
      // `localStorage` that exists but throws on read or write, as some private
      // browsing modes do: that escapes `persist`'s try/catch.
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as AuthState) };
        return { ...merged, users: withSeededUsers(merged.users ?? []) };
      },
    },
  ),
);
