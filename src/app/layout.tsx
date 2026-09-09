import type { Metadata } from "next";
import {
  Cinzel,
  Cormorant_Garamond,
  Dancing_Script,
  Great_Vibes,
  Playfair_Display,
} from "next/font/google";
import { wedding } from "@/lib/wedding-config";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: `Wedding Invitation | ${wedding.coupleShort}`,
  description: `You are invited to the wedding of ${wedding.groom.full} and ${wedding.bride.full} on ${wedding.dateLong} at ${wedding.venue.name}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${greatVibes.variable} ${dancing.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-ink">{children}</body>
    </html>
  );
}
