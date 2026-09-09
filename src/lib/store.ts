import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomBytes, randomUUID } from "crypto";
import type { Guest, RsvpReply } from "./types";

const STORE_NAME = "wedding-guests";
const STORE_KEY = "guests";
const LOCAL_PATH = path.join(process.cwd(), ".data", "guests.json");

function blobsEnabled(): boolean {
  return Boolean(
    process.env.NETLIFY ||
      process.env.NETLIFY_BLOBS_CONTEXT ||
      process.env.NETLIFY_BLOBS_TOKEN,
  );
}

async function readAll(): Promise<Guest[]> {
  if (blobsEnabled()) {
    try {
      const { getStore } = await import("@netlify/blobs");
      const store = getStore({ name: STORE_NAME, consistency: "strong" });
      const data = await store.get(STORE_KEY, { type: "json" });
      return Array.isArray(data) ? (data as Guest[]) : [];
    } catch {
      return [];
    }
  }
  try {
    const raw = await readFile(LOCAL_PATH, "utf8");
    const data = JSON.parse(raw) as Guest[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeAll(guests: Guest[]): Promise<void> {
  if (blobsEnabled()) {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore({ name: STORE_NAME, consistency: "strong" });
    await store.setJSON(STORE_KEY, guests);
    return;
  }
  await mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await writeFile(LOCAL_PATH, JSON.stringify(guests, null, 2), "utf8");
}

export function createToken(): string {
  return randomBytes(8).toString("base64url");
}

export async function listGuests(): Promise<Guest[]> {
  const guests = await readAll();
  return guests.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getGuestByToken(token: string): Promise<Guest | null> {
  const guests = await readAll();
  return guests.find((g) => g.token === token) ?? null;
}

export async function getGuestById(id: string): Promise<Guest | null> {
  const guests = await readAll();
  return guests.find((g) => g.id === id) ?? null;
}

export async function addGuest(input: {
  name: string;
  partySize: number;
}): Promise<Guest> {
  const guests = await readAll();
  const guest: Guest = {
    id: randomUUID(),
    token: createToken(),
    name: input.name.trim(),
    partySize: input.partySize,
    createdAt: new Date().toISOString(),
  };
  guests.push(guest);
  await writeAll(guests);
  return guest;
}

export async function updateGuest(
  id: string,
  patch: { name?: string; partySize?: number },
): Promise<Guest | null> {
  const guests = await readAll();
  const index = guests.findIndex((g) => g.id === id);
  if (index === -1) return null;
  const current = guests[index];
  guests[index] = {
    ...current,
    name: patch.name?.trim() ?? current.name,
    partySize: patch.partySize ?? current.partySize,
  };
  await writeAll(guests);
  return guests[index];
}

export async function deleteGuest(id: string): Promise<boolean> {
  const guests = await readAll();
  const next = guests.filter((g) => g.id !== id);
  if (next.length === guests.length) return false;
  await writeAll(next);
  return true;
}

export async function saveRsvp(
  token: string,
  reply: Omit<RsvpReply, "submittedAt">,
): Promise<Guest | null> {
  const guests = await readAll();
  const index = guests.findIndex((g) => g.token === token);
  if (index === -1) return null;
  guests[index] = {
    ...guests[index],
    rsvp: {
      ...reply,
      submittedAt: new Date().toISOString(),
    },
  };
  await writeAll(guests);
  return guests[index];
}
