import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center text-ink">
      <h1 className="font-display text-3xl">Page not found</h1>
      <Link href="/" className="gold-button mt-8">
        Back to the invitation
      </Link>
    </div>
  );
}
