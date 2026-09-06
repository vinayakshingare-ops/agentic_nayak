import { cookies } from "next/headers";
import { dbRepository } from "./db";
import { User } from "@/types";

const SESSION_COOKIE_NAME = "vitalis_session";
const DEMO_USER_ID = "demo-user-rahul";

export async function getCurrentUserId(): Promise<string> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (sessionCookie && sessionCookie.value) {
    return sessionCookie.value;
  }

  // Fallback to demo user so review/preview works instantly
  return DEMO_USER_ID;
}

export async function getCurrentUser(): Promise<User | null> {
  const userId = await getCurrentUserId();
  const user = dbRepository.findUserById(userId);
  return user || null;
}

export function setSessionCookie(userId: string) {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
