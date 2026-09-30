/**
 * A shared password in front of the student app, checked with HTTP Basic auth.
 * The browser shows its own sign-in box. Any username works; only the password
 * is checked against APP_PASSWORD. This is a stopgap until real accounts exist.
 */

export const BASIC_AUTH_CHALLENGE = 'Basic realm="Career OS app", charset="UTF-8"';

/** Compares in constant time so the check doesn't leak how much of the password was right. */
function safeEqual(a: string, b: string) {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  let diff = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i++) diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  return diff === 0;
}

/** True when an `Authorization: Basic …` header carries the right password. */
export function hasValidPassword(header: string | null, password: string) {
  if (!password || !header?.startsWith("Basic ")) return false;
  let decoded: string;
  try {
    decoded = new TextDecoder().decode(Uint8Array.from(atob(header.slice(6).trim()), (c) => c.charCodeAt(0)));
  } catch {
    return false;
  }
  const separator = decoded.indexOf(":");
  if (separator === -1) return false;
  return safeEqual(decoded.slice(separator + 1), password);
}
