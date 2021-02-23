import got from 'got';
import { ApiConfigBlock, Legislator } from '../datastore-interfaces';
import * as ny from './api-response';
import { Member } from './member';

export const getMembers = async (api: ApiConfigBlock, session: number) => {
  const request =
    api.baseURI +
    api.memberEndpoint +
    `/${session}?limit=1000&full=true&key=${api.key}`;

  try {
    const response = await got(request, { responseType: 'json' });

    // check for valid memberlist response from api
    if (!isListResponse(response.body)) throw 'api response is not a list';
    if (!isMemberList(response.body.result.items)) throw 'not a member-list';
    return mapToLegislatorList(response.body.result.items);
  } catch (error) {
    throw console.error('NY getMembers failed!\n\n', error);
  }
};

const isListResponse = (data: unknown): data is ny.ListResponse => {
  return (data as ny.ListResponse).result.items !== undefined;
};

const isMemberList = (data: unknown[]): data is Member[] => {
  return (data[0] as Member).memberId !== undefined;
};

const mapToLegislatorList = (raw: Member[]): Legislator[] => {
  const dt = new Date(Date.now()).toJSON();
  const source = 'New York Senate Open Legislation API';
  let legislators: Legislator[] = [];

  raw.forEach((e) =>
    legislators.push({
      name: {
        first: e.person.firstName,
        middle: e.person.middleName,
        last: e.person.lastName,
        suffix: e.person.suffix,
      },
      chamber: e.chamber,
      district: e.districtCode,
      imageURL: imageCheck(e.imgName),
      identifiers: [
        { source: source, value: e.shortName, desc: 'shortName' },
        { source: source, value: e.memberId, desc: 'memberId' },
        { source: source, value: e.sessionMemberId, desc: 'sessionMemberId' },
      ],
      updated: dt,
    })
  );
  return legislators;
};

const imageCheck = (img: unknown): string => {
  if ((img as string).length > 0)
    return `https://legislation.nysenate.gov/static/img/business_assets/members/mini/${img}`;
  else return '';
};
