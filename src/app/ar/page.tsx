import type { Metadata, Viewport } from "next";
import { WeddingARLoader } from "@/components/ar/WeddingARLoader";
import { wedding } from "@/lib/wedding-config";

export const metadata: Metadata = {
  title: `AR Experience | ${wedding.coupleShort}`,
  description: `A browser-based AR experience for the wedding of ${wedding.groom.full} and ${wedding.bride.full}.`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function ARPage() {
  return <WeddingARLoader />;
}
