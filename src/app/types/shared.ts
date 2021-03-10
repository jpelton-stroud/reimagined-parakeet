export interface Shared {
  identifier: string;
  name: string;
  sponsorships: {
    date: string;
    name: string;
    identifier: string;
  }[];
}
