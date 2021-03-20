import got, { Options } from 'got';
import { URLSearchParams } from 'url';
import { APIKEY } from './api-key';
import * as API from './types/nysenate-api';
import { Legislator } from '../app/legislator';
import { Legislation } from '../app/legislation';
import { Sponsorship } from '../app/shared';
import { UpdateDetail } from './types/updates';

// set api fetch defaults
const gotOptions: Options = {
  prefixUrl: 'https://legislation.nysenate.gov/api/3',
  responseType: 'json',
  resolveBodyOnly: true,
};

// Fetch data for a single bill from API
async function fetchBillInfo(target: string): Promise<API.Response> {
  gotOptions.url = `bills/${target}`;
  gotOptions.searchParams = new URLSearchParams([
    ['key', APIKEY],
    ['view', 'info'],
  ]);

  return got(gotOptions) as Promise<API.Response>;
}

// Fetch a list of updates to a bill from API
async function fetchBillUpdates(
  target: string,
  date?: string
): Promise<API.Response> {
  gotOptions.url = `bills/${target}/updates${date ? '/' + date : ''}`;
  gotOptions.searchParams = new URLSearchParams([
    ['key', APIKEY],
    ['limit', '5'],
  ]);

  return got(gotOptions) as Promise<API.Response>;
}

// Fetch a list of current legislators from API
async function fetchCurrentMembers(
  full: boolean = false,
  year: number = new Date().getFullYear(),
  chamber?: string
): Promise<API.Response<API.Member[]>> {
  gotOptions.url = `members/${year}${chamber ? '/' + chamber : ''}`;
  gotOptions.searchParams = new URLSearchParams([
    ['key', APIKEY],
    ['limit', '5'],
    ['full', full ? 'full' : 'false'],
  ]);

  return got(gotOptions) as Promise<API.Response<API.Member[]>>;
}

// Validate & unpack API response
function unpackResponse(d: API.Response) {
  return !API.isSuccess(d)
    ? new Error(d.message)
    : API.isItemsList(d.result)
    ? d.result.items
    : d.result;
}

function typeCheck(d: unknown) {
  return API.isBill(d);
}

// Transform bill data fetched from API to Popolo Motion
// Transform list of legislators fetched from API to list of Popolo Persons

// Sort list of bill updates

// exported triggers
export const test = async (billNo: string = 'S1034-2021') => {
  const part = billNo.split('-');
  const promises: Promise<any>[] = [];
  promises.push(fetchBillInfo(`${part[1]}/${part[0]}`));
  promises.push(fetchBillUpdates(`${part[1]}/${part[0]}`));
  promises.push(fetchCurrentMembers());

  try {
    const raw = await Promise.all(promises);
    const unpacked = raw.map((e) => unpackResponse(e));

    console.log(unpacked);
  } catch (error) {
    console.log(error);
  }
};
