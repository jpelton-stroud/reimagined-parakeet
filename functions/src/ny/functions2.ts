import got, { Options } from 'got';
import { URLSearchParams } from 'url';
import { APIKEY } from './api-key';
import * as API from './types/nysenate-api';
import { Legislator } from '../app/legislator';
import { Legislation } from '../app/legislation';
import { Sponsorship } from '../app/shared';

// set api fetch defaults
const gotOptions: Options = {
  prefixUrl: 'https://legislation.nysenate.gov/api/3',
  responseType: 'json',
  resolveBodyOnly: true,
};

// Fetch data for a single bill from API
function fetchBillInfo(target: string): Promise<API.Response<API.Bill>> {
  gotOptions.url = `bills/${target}`;
  gotOptions.searchParams = new URLSearchParams([
    ['key', APIKEY],
    ['view', 'info'],
  ]);

  return got(gotOptions) as Promise<API.Response<API.Bill>>;
}

// Fetch a list of updates to a bill from API
function fetchBillUpdates(
  target: string,
  date?: string
): Promise<API.Response<API.UpdateDetail[]>> {
  gotOptions.url = ['bills', target, 'updates', date].join('/');
  gotOptions.searchParams = new URLSearchParams([
    ['key', APIKEY],
    ['limit', '1000'],
    ['filter', 'cosponsor'],
  ]);

  return got(gotOptions) as Promise<API.Response<API.UpdateDetail[]>>;
}

// Fetch a list of current legislators from API
function fetchMembers(
  year: number = new Date().getFullYear(),
  chamber?: string
): Promise<API.Response<API.Member[]>> {
  gotOptions.url = ['members', year, chamber].join('/');
  gotOptions.searchParams = new URLSearchParams([
    ['key', APIKEY],
    ['limit', '1000'],
    ['full', 'true'],
  ]);

  return got(gotOptions) as Promise<API.Response<API.Member[]>>;
}

// Transform bill data fetched from API to Popolo Motion
const billToMotion = (bill: API.Bill): Legislation => ({
  name: '',
  identifier: bill.basePrintNoStr,
  version: bill.activeVersion,
  title: bill.title,
  creator_id: generateLegislatorIdentifier(bill.sponsor.member),
  sponsorships: [],
  updated_at: '',
});

// Transform member data fetched from API to Popolo Person
const memberToPerson = (m: API.Member): Legislator => ({
  identifier: generateLegislatorIdentifier(m),
  chamber: m.chamber,
  name: m.fullName,
  updated_at: new Date().toJSON(),
  sponsorships: [],
});

// Transform list of bill cosponsor updates
function processUpdateDetails(
  rawUpdates: API.UpdateDetail[],
  rawMembers: API.Member[]
) {
  const sorted: { [key: string]: Sponsorship[] } = {
    Insert: [],
    Delete: [],
  };
  rawUpdates.forEach((u: API.UpdateDetail) => {
    if (u.action !== 'Update') {
      const m = rawMembers.find(
        (m) => u.fields['Session Member Id'] === m.sessionMemberId.toString()
      );
      m === undefined
        ? console.error(
            `${u.id.basePrintNoStr}: sessionMemberId ${u.fields['Session Member Id']} not found`
          )
        : sorted[u.action].push({ ...mSlug(m), ...vSlug(u) });
    }
  });

  return sorted;
}

// exported triggers
export const getBillSponsorshipUpdates = async (billNo: string) => {
  try {
    const fetchedData = await Promise.all([
      fetchBillUpdates(parseBillStr(billNo)).then(API.unpack),
      fetchMembers().then(API.unpack),
    ]);

    return processUpdateDetails(...fetchedData);
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getBill = (billNo: string): Promise<Legislation> =>
  fetchBillInfo(parseBillStr(billNo)).then(API.unpack).then(billToMotion);

export const getMembers = (): Promise<Legislator[]> =>
  fetchMembers()
    .then(API.unpack)
    .then((list) => list.map(memberToPerson));

// helpers
const parseBillStr = (basePrintNoStr: string) =>
  basePrintNoStr.split('-').reverse().join('/');
const generateLegislatorIdentifier = (m: API.Member) =>
  `${m.shortName}-${m.chamber}-${m.memberId}-${m.sessionMemberId}`;
const mSlug = (m: API.Member) => ({
  name: m.fullName,
  identifier: generateLegislatorIdentifier(m),
});
const vSlug = (f: API.UpdateDetail) => ({
  date: f.fields['Created Date Time'],
  version:
    f.fields['Bill Amend Version'] !== ' '
      ? f.fields['Bill Amend Version']
      : '',
});
