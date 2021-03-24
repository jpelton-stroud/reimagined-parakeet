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
function fetchCurrentMembers(
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
// Transform list of legislators fetched from API to list of Popolo Persons

// Transform list of bill updates
function processUpdateDetails(
  rawUpdates: API.UpdateDetail[],
  rawMembers: API.Member[]
) {
  const sorted: { [key: string]: Sponsorship[] } = {
    Insert: [],
    Delete: [],
  };
  rawUpdates.forEach((e: API.UpdateDetail) => {
    if (e.action !== 'Update') {
      const member = rawMembers.find(
        (m) => e.fields['Session Member Id'] === m.sessionMemberId.toString()
      );
      member === undefined
        ? console.error(
            `sessionMemberId ${e.fields['Session Member Id']} not found`,
            e.id.basePrintNoStr
          )
        : sorted[e.action].push({
            name: member.fullName,
            identifier: generateLegislatorIdentifier(member),
            date: e.fields['Created Date Time'],
            version:
              e.fields['Bill Amend Version'] !== ' '
                ? e.fields['Bill Amend Version']
                : '',
          });
    }
  });

  return sorted;
}

function generateLegislatorIdentifier(m: API.Member): string {
  return `${m.shortName}-${m.chamber}-${m.memberId}-${m.sessionMemberId}`;
}

// exported triggers
export const getBillSponsorshipUpdates = async (
  billNo: string = 'A2681-2021'
) => {
  try {
    const fetchedData = await Promise.all([
      fetchBillUpdates(billNo.split('-').reverse().join('/')).then(API.unpack),
      fetchCurrentMembers().then(API.unpack),
    ]);

    return processUpdateDetails(...fetchedData);
  } catch (error) {
    console.log(error);
    return;
  }
};
