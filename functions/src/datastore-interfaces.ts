export interface Legislature extends Metadata {
  name: {
    short: string;
    full: string;
  };
  unicameral: boolean;
  sessionLength: number;
  chamber?: {
    upper: string;
    lower: string;
  };
  api: {
    key: string;
    baseURI: string;
    memberEndpoint: string;
    billEndpoint: string;
  };
}

export interface Legislator extends Metadata {
  name: {
    first: string;
    middle?: string;
    last: string;
    suffix?: string;
  };
  chamber?: string;
  district: number;
  imageURL: null | string;
}

export interface Bill extends Metadata {
  name: {
    short: string;
    full: string;
  };
  session: number;
  cosponsors: {
    sponsorId: string;
    primary: boolean;
    version: number;
    date: string;
  }[];
}

interface Metadata {
  identifiers: [];
  updated: string;
}
