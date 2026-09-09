import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  getAdminPassword,
  sessionCookieOptions,
  signSession,
} from "@/lib/auth";
import { timingSafeEqual } from "crypto";

export const runtime = "nodejs";

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const password = getAdminPassword();
  if (!password) {
    return NextResponse.json(
      { error: "Admin password is not configured." },
      { status: 500 },
    );
  }

  let body: { password?: unknown };
  try {
    body = (await request.json()) as { password?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const submitted = typeof body.password === "string" ? body.password : "";
  if (!safeEqual(submitted, password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, signSession(), sessionCookieOptions(60 * 60 * 24 * 7));
  return res;
}
