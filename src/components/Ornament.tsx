export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" className={className} fill="none" aria-hidden>
      <path
        d="M8 12h78M232 12h-78"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.7"
      />
      <path
        d="M96 12c6-7 12-7 18 0 6 7 12 7 18 0"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <circle cx="120" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}
