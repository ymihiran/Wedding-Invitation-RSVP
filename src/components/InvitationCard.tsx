"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoldFlakes } from "@/components/GoldFlakes";
import { Ornament } from "@/components/Ornament";
import { RevealCover } from "@/components/RevealCover";
import { Countdown } from "@/components/Countdown";
import { VenueMap } from "@/components/VenueMap";
import { RsvpForm } from "@/components/RsvpForm";
import { AgendaTimeline } from "@/components/AgendaTimeline";
import { partyWording, wedding } from "@/lib/wedding-config";
import type { Guest } from "@/lib/types";

type InvitationCardProps = {
  guest?: Guest;
  preview?: boolean;
};

export function InvitationCard({ guest, preview = false }: InvitationCardProps) {
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const invitedName = guest?.name ?? "Family & Friends";

  useEffect(() => {
    if (revealed) {
      document.body.classList.remove("invite-locked");
      return;
    }
    document.body.classList.add("invite-locked");
    return () => document.body.classList.remove("invite-locked");
  }, [revealed]);

  function openInvitation() {
    if (opened) return;
    setOpened(true);
    window.setTimeout(() => setRevealed(true), 1800);
  }

  return (
    <div className="relative min-h-screen bg-cream text-ink">
      {!revealed && (
        <RevealCover
          opened={opened}
          guestName={invitedName}
          partySize={guest?.partySize}
          onReveal={openInvitation}
        />
      )}

      {revealed && <GoldFlakes />}

      <div
        id="main-content"
        className={`transition-opacity duration-[1500ms] ease-out ${
          revealed ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <header className="invite-hero">
          <p className="font-cinzel text-[0.65rem] font-semibold tracking-[0.45em] text-gold uppercase">
            Together with their families
          </p>
          <h1 className="hero-title mt-4 font-script text-[clamp(3.1rem,12vw,5.8rem)] gold-foil">
            {wedding.groom.first}
            <span className="mx-2 font-serif text-[0.45em] text-gold"> & </span>
            {wedding.bride.first}
          </h1>
          <p className="mt-5 font-cinzel text-sm tracking-[0.42em] text-ink">
            {wedding.dateDisplay}
          </p>
        </header>

        <section id="invitation">
          <article className="invitation-card">
            <p className="font-cinzel text-[0.72rem] font-semibold tracking-[0.35em] text-gold uppercase">
              Kindly Invited
            </p>
            <h2 className="mt-3 font-dancing text-[clamp(2rem,7vw,2.8rem)] text-ink">
              {invitedName}
            </h2>
            {guest && (
              <p className="mt-1 font-serif text-base italic text-gold">
                {partyWording(guest.partySize)}
              </p>
            )}
            <Ornament className="mx-auto mt-5 h-6 w-52 text-gold" />

            <p className="mt-8 font-cinzel text-[0.7rem] font-semibold tracking-[0.38em] text-gold uppercase">
              Save the date
            </p>
            <p className="couple-names mt-2 py-1 font-script text-[clamp(2.4rem,8vw,3.5rem)] leading-[1.35] text-ink">
              {wedding.coupleShort}
            </p>
            <p className="mx-auto mt-3 max-w-sm font-serif text-[0.95rem] italic leading-8 text-gold-soft">
              {wedding.parents.bride}
              <br />&<br />
              {wedding.parents.groom}
            </p>
            <div className="mt-6 border-y border-[#eee] py-4 font-display text-[1.25rem] text-ink">
              {wedding.dateLong}
            </div>
            <p className="mt-5 font-cinzel text-[0.78rem] font-semibold tracking-[0.18em] text-gold uppercase">
              {wedding.venue.name}
            </p>
            <div className="mt-8">
              <Countdown />
            </div>
          </article>

          <nav className="btn-stack">
            {!preview && guest && (
              <a href="#rsvp" className="gold-button">
                RSVP Attendance
              </a>
            )}
            <a href="#venue" className="gold-choice">
              View Directions
            </a>
            <a href={wedding.venue.directionsUrl} target="_blank" rel="noopener noreferrer" className="gold-choice">
              Start Navigation
            </a>
            <Link href="/ar" className="gold-choice">
              Experience AR
            </Link>
          </nav>
        </section>

        {preview && (
          <p className="-mt-6 mb-10 px-6 text-center font-serif text-sm text-gold-soft">
            Open your personal invitation link to send an RSVP.
          </p>
        )}

        <AgendaTimeline />

        <div className="mx-auto max-w-[650px] px-4 pb-6">
          <VenueMap />
        </div>

        {!preview && guest && (
          <div className="mx-auto max-w-[650px] px-4 pb-4">
            <RsvpForm guest={guest} />
          </div>
        )}

        <footer className="bg-[#222] px-6 py-16 text-center">
          <p className="font-cinzel text-[0.7rem] tracking-[0.35em] text-gold uppercase">
            Contact us
          </p>
          <p className="mt-4 py-1 font-script text-4xl leading-[1.35] text-[color:#d4af37]">
            {wedding.coupleShort}
          </p>
        </footer>
      </div>
    </div>
  );
}
