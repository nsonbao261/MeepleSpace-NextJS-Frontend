export const ROLES = ["admin", "customer"] as const;

export type Role = (typeof ROLES)[number];

export type User = {
  id: string;
  /**
   * Unique. Trimmed and lowercased before it is stored, compared, or copied into
   * an error message, so uniqueness is case-insensitive and one address is never
   * held twice under two spellings. The only identifier: there is no `username`.
   */
  email: string;
  firstName: string;
  lastName: string;
  /**
   * ISO `YYYY-MM-DD`. Optional. A real calendar date that is not in the future,
   * and deliberately no age threshold — a board game shop has no age gate.
   */
  dateOfBirth: string | null;
  /** Vietnamese mobile, `+84` normalised to a leading `0`. Optional. `null`, never `""`. */
  phone: string | null;
  /**
   * SECURITY: this is **not** a password hash and is not security. It is the
   * 8-character 32-bit FNV-1a digest written by `mockDigest` in
   * `src/stores/auth-store.ts`, which exists for one reason only: so no
   * plaintext password reaches `localStorage`. 32 bits is brute-forceable in
   * microseconds, so it protects nothing and must never be treated as a
   * credential. It never leaves the store — components receive `PublicUser`.
   */
  passwordDigest: string;
  role: Role;
  /**
   * Absolute URL, or `null` for "no custom image". A real nullable field, not a
   * placeholder: every avatar consumer reads it and falls back to initials only
   * when it is `null`, so the backend can fill it with no rewrite. Nothing in
   * this feature writes it, because there is no upload.
   */
  avatarUrl: string | null;
  createdAt: string;
};

/**
 * `User` without the digest. Components receive this and never `User` — the type
 * boundary is the enforcement, so there is no convention to hold to.
 */
export type PublicUser = Omit<User, "passwordDigest">;
