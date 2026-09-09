import { notFound } from "next/navigation";
import { InvitationCard } from "@/components/InvitationCard";
import { getGuestByToken } from "@/lib/store";
import { wedding } from "@/lib/wedding-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  if (!guest) {
    return { title: "Invitation not found" };
  }
  return {
    title: `${guest.name} — ${wedding.coupleShort}`,
    description: `You are invited to the wedding of ${wedding.coupleShort}`,
  };
}

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  if (!guest) notFound();
  return <InvitationCard guest={guest} />;
}
