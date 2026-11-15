import { cookies } from "next/headers";
import { readSession, signSession } from "./auth";
import { authSecret } from "./secret";

const COOKIE = "session";
const MAX_AGE = 14 * 24 * 60 * 60;

export async function getSession(): Promise<{ email: string } | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const email = readSession(token, authSecret(), Date.now());
  return email ? { email } : null;
}

export async function setSession(email: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, signSession(email, authSecret(), Date.now()), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
