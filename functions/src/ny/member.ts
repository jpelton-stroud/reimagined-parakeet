interface Person {
  personId: number;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  prefix: string;
  suffix: string;
  verified: boolean;
  imgName: string;
}

interface SessionMember {
  sessionMemberId: number;
  shortName: string;
  sessionYear: number;
  districtCode: number;
  alternate: boolean;
  memberId: number;
}

export interface Member extends SessionMember {
  chamber: 'ASSEMBLY' | 'SENATE';
  incumbent: boolean;
  fullName: string;
  imgName: string;
  sessionShortNameMap: {
    [key: string]: SessionMember[];
  };
  person: Person;
}
