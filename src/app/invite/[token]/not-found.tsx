import Link from "next/link";

export default function InviteNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center text-ink">
      <p className="font-cinzel text-[10px] tracking-[0.4em] text-gold uppercase">Invitation</p>
      <h1 className="mt-4 font-display text-3xl">This link is not valid</h1>
      <p className="mt-3 max-w-sm font-serif text-sm text-gold-soft">
        Please use the personal invitation you received from Chamika & Nadeesha.
      </p>
      <Link href="/" className="gold-button mt-8">
        View the wedding card
      </Link>
    </div>
  );
}
