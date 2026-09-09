import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteGuest, updateGuest } from "@/lib/store";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: { name?: unknown; partySize?: unknown };
  try {
    body = (await request.json()) as { name?: unknown; partySize?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const patch: { name?: string; partySize?: number } = {};
  if (typeof body.name === "string" && body.name.trim()) {
    patch.name = body.name.trim();
  }
  if (body.partySize !== undefined) {
    const partySize =
      typeof body.partySize === "number" ? Math.floor(body.partySize) : Number(body.partySize);
    if (!Number.isFinite(partySize) || partySize < 1 || partySize > 30) {
      return NextResponse.json({ error: "Party size must be between 1 and 30." }, { status: 400 });
    }
    patch.partySize = partySize;
  }

  const guest = await updateGuest(id, patch);
  if (!guest) {
    return NextResponse.json({ error: "Guest not found." }, { status: 404 });
  }
  return NextResponse.json({ guest });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const ok = await deleteGuest(id);
  if (!ok) {
    return NextResponse.json({ error: "Guest not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
