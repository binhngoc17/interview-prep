import { createHmac, timingSafeEqual } from "node:crypto";

const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export type LoginCode = {
  email: string;
  hash: string;
  expiresAt: number;
  attempts: number;
  used: boolean;
};

export type VerifyResult = {
  status: "valid" | "used" | "expired" | "locked" | "invalid";
  record: LoginCode;
};

export function normalizeEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return null;
  return email;
}

export function hashLoginCode(
  email: string,
  code: string,
  secret: string,
): string {
  return createHmac("sha256", secret).update(`${email}:${code}`).digest("hex");
}

export function issueLoginCode(
  email: string,
  secret: string,
  now: number,
  randomCode: () => string = () =>
    String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0"),
): { code: string; record: LoginCode } {
  const code = randomCode();
  return {
    code,
    record: {
      email,
      hash: hashLoginCode(email, code, secret),
      expiresAt: now + CODE_TTL_MS,
      attempts: 0,
      used: false,
    },
  };
}

export function verifyLoginCode(
  record: LoginCode,
  code: string,
  secret: string,
  now: number,
): VerifyResult {
  if (record.used) return { status: "used", record };
  if (now > record.expiresAt) return { status: "expired", record };
  if (record.attempts >= MAX_ATTEMPTS) return { status: "locked", record };

  const expected = Buffer.from(record.hash);
  const actual = Buffer.from(hashLoginCode(record.email, code, secret));
  const matches =
    expected.length === actual.length && timingSafeEqual(expected, actual);
  if (!matches) {
    record.attempts += 1;
    return { status: "invalid", record };
  }
  record.used = true;
  return { status: "valid", record };
}

export function signSession(
  email: string,
  secret: string,
  now: number,
): string {
  const body = Buffer.from(
    JSON.stringify({ email, exp: now + SESSION_TTL_MS }),
  ).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readSession(
  token: string,
  secret: string,
  now: number,
): string | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret)
    .update(body)
    .digest("base64url");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right))
    return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      email?: unknown;
      exp?: unknown;
    };
    if (typeof payload.email !== "string" || typeof payload.exp !== "number")
      return null;
    if (now > payload.exp) return null;
    return payload.email;
  } catch {
    return null;
  }
}
