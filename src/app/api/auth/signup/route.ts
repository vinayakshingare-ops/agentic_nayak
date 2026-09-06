import { NextResponse } from "next/server";
import { dbRepository } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { User } from "@/types";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const existing = dbRepository.findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Account with this email already exists" }, { status: 400 });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      passwordHash: password || "temp123",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbRepository.createUser(newUser);
    setSessionCookie(newUser.id);

    return NextResponse.json({ success: true, redirect: "/onboarding", user: newUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create account" }, { status: 500 });
  }
}
