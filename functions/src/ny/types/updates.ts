export interface UpdateToken {
  id: {
    basePrintNo: string;
    session: number;
    basePrintNoStr: string;
  };
  contentType: string;
  sourceId: string;
  sourceDateTime: string;
  processedDateTime: string;
}

export interface UpdateDetail extends UpdateToken {
  action: Action;
  fieldCount: number;
  scope: Scope;
  fields: Fields;
}

type Scope =
  | 'Bill'
  | 'Bill Sponsor'
  | 'Bill Amendment Cosponsor'
  | 'Bill Amendment Multi Sponsor';
type Action = 'Insert' | 'Delete' | 'Update';
type Fields = BillSponsor | BillCosponsor | BillVersion;

interface BillVersion {
  'Active Version': string;
}
interface BillSponsor {
  'Created Date Time': string;
  'Session Member Id': string;
  'Rules Sponsor': string;
  'Budget Bill': string;
}
interface BillCosponsor {
  'Created Date Time': string;
  'Session Member Id': string;
  'Bill Amend Version': string;
  'Sequence No': string;
}
