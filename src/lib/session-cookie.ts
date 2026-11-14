import { AUTH_CONFIG } from "@/constants/auth";

export function getRefreshCookie(): string | null {
  const name = `${AUTH_CONFIG.REFRESH_COOKIE_NAME}=`;
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

export function setRefreshCookie(token: string, rememberMe: boolean): void {
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  let cookie = `${AUTH_CONFIG.REFRESH_COOKIE_NAME}=${token}; Path=/; SameSite=Lax`;
  if (isHttps) {
    cookie += "; Secure";
  }
  if (rememberMe) {
    cookie += `; Max-Age=${AUTH_CONFIG.REMEMBER_ME_DAYS * 24 * 60 * 60}`;
  }
  document.cookie = cookie;
}

export function clearRefreshCookie(): void {
  document.cookie = `${AUTH_CONFIG.REFRESH_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}
