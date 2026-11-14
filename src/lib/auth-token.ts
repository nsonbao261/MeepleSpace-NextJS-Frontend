export function encodeToken(payload: object): string {
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeToken<T>(token: string): T {
  const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const json = decodeURIComponent(escape(atob(padded)));
  return JSON.parse(json) as T;
}

export function isExpired(exp: number): boolean {
  return Date.now() >= exp;
}
