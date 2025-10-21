export function isValidToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(atob(parts[1]));
    console.log("Token payload:", payload);
    const exp = payload.exp;
    if (typeof exp !== "number") return false;
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  } catch {
    return false;
  }
}
