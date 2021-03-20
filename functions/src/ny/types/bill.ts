import { Member } from './member';
import { Items } from './shared';

export interface Bill {
  basePrintNoStr: string;
  title: string;
  publishedDateTime: string;
  activeVersion: string;
  sponsor: {
    member: Member;
    budget: boolean;
    rules: boolean;
  };
  summary: string;
  amendments: Items<{ [key: string]: Amendment }>;
}

interface Amendment extends BillId {
  sameAs: Items<BillId[]>;
  coSponsors: Items<Member[]>;
  multiSponsors: Items<Member[]>;
}

interface BillId {
  basePrintNo: string;
  session: string;
  basePrintNoStr: string;
  printNo: string;
  version: string;
}

export function isBill(e: unknown): e is Bill {
  return (e as Bill).activeVersion !== undefined;
}
