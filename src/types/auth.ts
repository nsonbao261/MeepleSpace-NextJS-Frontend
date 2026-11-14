import { Account, AccountRole, Gender } from "./account";

export type LoginInput = { email: string; password: string; rememberMe: boolean };
export type RegisterInput = Omit<Account, "id" | "role" | "password"> & {
  password: string;
  passwordConfirmation: string;
  termsAccepted: boolean;
};
export type ResetPasswordInput = { email: string; password: string; passwordConfirmation: string };

export type AuthSession = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};

export type PublicUser = Omit<Account, "password">;

export type AccessTokenPayload = {
  sub: string;
  role: AccountRole;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  avatarUrl?: string;
  exp: number;
};

export type RefreshTokenPayload = { sub: string; exp: number };

export type AuthErrorCode =
  "invalid-credentials" | "email-taken" | "invalid-token" | "expired-token";
