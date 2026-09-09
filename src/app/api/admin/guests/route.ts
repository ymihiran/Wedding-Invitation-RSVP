import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { addGuest, listGuests } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const guests = await listGuests();
  return NextResponse.json({ guests });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: unknown; partySize?: unknown };
  try {
    body = (await request.json()) as { name?: unknown; partySize?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const partySize =
    typeof body.partySize === "number" ? Math.floor(body.partySize) : Number(body.partySize);

  if (!name) {
    return NextResponse.json({ error: "Guest name is required." }, { status: 400 });
  }
  if (!Number.isFinite(partySize) || partySize < 1 || partySize > 30) {
    return NextResponse.json({ error: "Party size must be between 1 and 30." }, { status: 400 });
  }

  const guest = await addGuest({ name, partySize });
  return NextResponse.json({ guest }, { status: 201 });
}
