import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PublicUser, User } from "@/types/user";

function mockDigest(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let hash = 0x811c9dc5;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

const SEED_PASSWORD = "demo1234";

const RESET_TOKEN_BYTES = 8;
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

export type PendingReset = {
  token: string;
  email: string;

  expiresAt: string;
};

type AuthState = {
  users: User[];

  sessionUserId: string | null;

  pendingReset: PendingReset | null;
};

const SEED_USERS: User[] = [
  {
    id: "seed-owner",
    email: "owner@meeplespace.dev",
    firstName: "Ada",
    lastName: "Meeple",

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

const GOOGLE_MOCK_EMAIL = "google.mock@meeplespace.dev";

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function emptyToNull(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

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
        const digest = mockDigest(password);
        const user = get().users.find(
          (candidate) => candidate.email === normaliseEmail(email),
        );
        if (user === undefined || user.passwordDigest !== digest) return null;
        set({ sessionUserId: user.id });
        return toPublicUser(user);
      },

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

      version: 1,
      migrate: () => createSeedState(),
      storage: createJSONStorage(() => localStorage),

      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as AuthState) };
        return { ...merged, users: withSeededUsers(merged.users ?? []) };
      },
    },
  ),
);
