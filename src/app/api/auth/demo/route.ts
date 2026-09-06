import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";

export async function POST() {
  const demoUserId = "demo-user-rahul";
  setSessionCookie(demoUserId);
  return NextResponse.json({ success: true, redirect: "/dashboard" });
}

export async function GET() {
  const demoUserId = "demo-user-rahul";
  setSessionCookie(demoUserId);
  return NextResponse.redirect(new URL("/dashboard", "http://localhost:3000"));
}
