export type RsvpReply = {
  attending: boolean;
  count: number;
  note: string;
  submittedAt: string;
};

export type Guest = {
  id: string;
  token: string;
  name: string;
  partySize: number;
  createdAt: string;
  rsvp?: RsvpReply;
};
