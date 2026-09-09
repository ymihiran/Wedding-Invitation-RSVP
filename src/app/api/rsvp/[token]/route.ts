import { NextResponse } from "next/server";
import { getGuestByToken, saveRsvp } from "@/lib/store";

export const runtime = "nodejs";

type Body = {
  attending?: unknown;
  count?: unknown;
  note?: unknown;
};

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const guest = await getGuestByToken(token);
  if (!guest) {
    return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body.attending !== "boolean") {
    return NextResponse.json({ error: "Please choose attendance." }, { status: 400 });
  }

  const attending = body.attending;
  let count = 0;
  if (attending) {
    const raw = typeof body.count === "number" ? body.count : guest.partySize;
    count = Math.min(guest.partySize, Math.max(1, Math.floor(raw)));
  }

  const note = typeof body.note === "string" ? body.note.trim().slice(0, 400) : "";
  const updated = await saveRsvp(token, { attending, count, note });
  return NextResponse.json({ guest: updated });
}
