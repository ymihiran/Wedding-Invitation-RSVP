export const wedding = {
  groom: {
    first: "Chamika",
    last: "Wickramasinghe",
    full: "Chamika Wickramasinghe",
    phone: "",
  },
  bride: {
    first: "Nadeesha",
    last: "Hasangi",
    full: "Nadeesha Hasangi",
    phone: "",
  },
  coupleShort: "Chamika & Nadeesha",
  dateIso: "2027-08-09T16:00:00+05:30",
  dateDisplay: "09 . 08 . 2027",
  dateLong: "Monday, 9 August 2027",
  weekday: "Monday",
  parents: {
    bride: "Daughter of Mr. & Mrs. Hasangi",
    groom: "Son of Mr. & Mrs. Wickramasinghe",
  },
  venue: {
    name: "Grand Hemalie Hotel, Matara",
    address: "No. 77 Kamburugamuwa, Galle Road, Matara",
    mapsQuery: "Grand Hemalie Hotel, Matara",
    embedUrl:
      "https://maps.google.com/maps?q=Grand+Hemalie+Hotel+Matara&t=&z=16&ie=UTF8&iwloc=&output=embed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Grand+Hemalie+Hotel,+Matara",
  },
  agenda: [
    { time: "04:00 PM", title: "Guest Arrival" },
    { time: "04:30 PM", title: "The Ceremony" },
    { time: "07:00 PM", title: "Dinner & Reception" },
    { time: "10:00 PM", title: "Farewell" },
  ],
} as const;

export function partyWording(partySize: number): string {
  if (partySize <= 1) return "You";
  if (partySize === 2) return "Both of you";
  return "All of you";
}
