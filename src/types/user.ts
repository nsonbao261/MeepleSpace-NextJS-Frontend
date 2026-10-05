export const ROLES = ["admin", "customer"] as const;

export type Role = (typeof ROLES)[number];

export type User = {
  id: string;

  email: string;
  firstName: string;
  lastName: string;

  dateOfBirth: string | null;

  phone: string | null;

  passwordDigest: string;
  role: Role;

  avatarUrl: string | null;
  createdAt: string;
};

export type PublicUser = Omit<User, "passwordDigest">;
