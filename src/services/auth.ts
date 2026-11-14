import { accounts as initialAccounts } from "@/data/accounts.mock";
import {
  Account,
  AuthSession,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  AuthErrorCode,
  PublicUser,
  AccessTokenPayload,
  RefreshTokenPayload,
} from "@/types";
import { encodeToken, decodeToken, isExpired } from "@/lib/auth-token";
import { AUTH_CONFIG } from "@/constants/auth";

// Module-level DB
let db = initialAccounts.map((a) => ({ ...a }));

export class AuthError extends Error {
  constructor(public code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
  }
}

async function delay() {
  if (process.env.NODE_ENV === "test") return;
  await new Promise((resolve) => setTimeout(resolve, 400));
}

export function resetAuthDbForTests() {
  db = initialAccounts.map((a) => ({ ...a }));
}

function generateTokens(account: PublicUser) {
  const exp = Date.now() + AUTH_CONFIG.TOKEN_TTL_MS;
  const accessToken = encodeToken({
    sub: account.id,
    role: account.role,
    name: account.name,
    email: account.email,
    firstName: account.firstName,
    lastName: account.lastName,
    dateOfBirth: account.dateOfBirth,
    gender: account.gender,
    avatarUrl: account.avatarUrl,
    exp,
  } satisfies AccessTokenPayload);

  const refreshToken = encodeToken({
    sub: account.id,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
  } satisfies RefreshTokenPayload);

  return { accessToken, refreshToken };
}

function toPublicUser(account: Account): PublicUser {
  const { password, ...user } = account;
  void password;
  return user;
}

export async function login({ email, password }: LoginInput): Promise<AuthSession> {
  await delay();
  const account = db.find((a) => a.email === email && a.password === password);
  if (!account) throw new AuthError("invalid-credentials");

  const { accessToken, refreshToken } = generateTokens(account);
  return { user: toPublicUser(account), accessToken, refreshToken };
}

export async function register(input: RegisterInput): Promise<AuthSession> {
  await delay();
  if (db.some((a) => a.email === input.email)) throw new AuthError("email-taken");

  const newAccount = {
    id: `acc_${Math.random().toString(36).slice(2)}`,
    name: `${input.firstName} ${input.lastName}`,
    email: input.email,
    password: input.password,
    firstName: input.firstName,
    lastName: input.lastName,
    dateOfBirth: input.dateOfBirth,
    gender: input.gender,
    avatarUrl: input.avatarUrl,
    role: "user" as const,
  };
  db.push(newAccount);

  const { accessToken, refreshToken } = generateTokens(newAccount);
  return { user: toPublicUser(newAccount), accessToken, refreshToken };
}

export async function signInWithGoogle(): Promise<AuthSession> {
  await delay();
  const account = db.find((a) => a.id === "acc_demo_user");
  if (!account) throw new AuthError("invalid-credentials");

  const { accessToken, refreshToken } = generateTokens(account);
  return { user: toPublicUser(account), accessToken, refreshToken };
}

export async function refresh(refreshToken: string): Promise<{ accessToken: string }> {
  await delay();
  let payload: RefreshTokenPayload;
  try {
    payload = decodeToken<RefreshTokenPayload>(refreshToken);
  } catch {
    throw new AuthError("invalid-token");
  }

  if (isExpired(payload.exp)) throw new AuthError("expired-token");

  const account = db.find((a) => a.id === payload.sub);
  if (!account) throw new AuthError("invalid-token");

  const { accessToken } = generateTokens(account);
  return { accessToken };
}

export async function logout(): Promise<void> {
  await delay();
}

export async function requestPasswordReset(email: string): Promise<void> {
  await delay();
  void email;
}

export async function resetPassword({ email, password }: ResetPasswordInput): Promise<void> {
  await delay();
  const account = db.find((a) => a.email === email);
  if (account) {
    account.password = password;
  }
}
