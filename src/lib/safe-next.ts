export function isSafeNextPath(path: string | null): boolean {
  if (!path) return false;
  // Accept only relative paths starting with /
  // Reject external URLs (http/https), protocol-relative (//), or backslashes
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");
}
