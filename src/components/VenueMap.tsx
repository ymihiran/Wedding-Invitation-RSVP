import { wedding } from "@/lib/wedding-config";

export function VenueMap() {
  return (
    <section id="venue" className="invitation-card !mt-0 mb-10">
      <p className="font-cinzel text-[0.7rem] font-semibold tracking-[0.35em] text-gold uppercase">
        Venue
      </p>
      <h2 className="mt-3 font-display text-2xl text-ink">{wedding.venue.name}</h2>
      <p className="mt-2 font-serif text-sm text-gold-soft">{wedding.venue.address}</p>
      <div className="mt-6 overflow-hidden border border-[#eee]">
        <iframe
          title="Grand Hemalie Hotel, Matara"
          src={wedding.venue.embedUrl}
          className="h-56 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={wedding.venue.directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="gold-button mt-6"
      >
        Start Navigation
      </a>
    </section>
  );
}
