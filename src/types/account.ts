export type Gender = "male" | "female" | "non-binary" | "prefer-not-to-say";
export type AccountRole = "user" | "admin" | "owner";

export interface Account {
  id: string;
  name: string; // Public display name
  email: string;
  password: string; // Hash (mocked)
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: Gender;
  avatarUrl?: string;
  role: AccountRole;
}
