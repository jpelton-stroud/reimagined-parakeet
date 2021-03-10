export interface MemberSessionId {
  memberId: number;
  sessionMemberId: number;
  shortName: string;
  sessionYear: number;
  districtCode: number;
  alternate: boolean;
}
export interface Member extends MemberSessionId {
  chamber: string;
  incumbent: boolean;
  fullName: string;
  imgName: string;
  sessionShortNameMap?: {
    [key: string]: MemberSessionId[];
  };
  person?: {
    personId: number;
    fullName: string;
    firstName: string;
    middleName: null;
    lastName: string;
    email: null;
    prefix: string;
    suffix: null;
    verified: boolean;
    imgName: string;
  };
}
