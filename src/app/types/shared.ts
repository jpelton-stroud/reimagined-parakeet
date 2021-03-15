export interface Sponsorship {
  date: string;
  name: string;
  identifier: string;
  version: string;
}

export interface Shared {
  identifier: string;
  name: string;
  sponsorships: Sponsorship[];
}
