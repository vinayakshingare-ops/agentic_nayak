import { NextResponse } from "next/server";
import { dbRepository } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = dbRepository.findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
    }

    // In demo environment, verify match or accept demo
    if (user.passwordHash && password && user.passwordHash !== password) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    setSessionCookie(user.id);
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to log in" }, { status: 500 });
  }
}
