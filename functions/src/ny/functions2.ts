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
  gotOptions.url = `bills/${target}/updates${date ? '/' + date : ''}`;
  gotOptions.searchParams = new URLSearchParams([
    ['key', APIKEY],
    ['limit', '1000'],
  ]);

  return got(gotOptions) as Promise<API.Response<API.UpdateDetail[]>>;
}

// Fetch a list of current legislators from API
function fetchCurrentMembers(
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

// Transform bill data fetched from API to Popolo Motion
// Transform list of legislators fetched from API to list of Popolo Persons
// Transform list of bill updates
function processUpdateDetails(
  updateList: API.UpdateDetail[],
  memberList: API.Member[]
) {}

// exported triggers
export const test = async (billNo: string = 'S1034-2021') => {
  try {
    const part = billNo.split('-');
    const fetchedData = await Promise.all([
      // fetchBillInfo(`${part[1]}/${part[0]}`).then(API.unpack),
      fetchBillUpdates(`${part[1]}/${part[0]}`).then(API.unpack),
      fetchCurrentMembers().then(API.unpack),
    ]);

    processUpdateDetails(...fetchedData);
    console.log(fetchedData);
  } catch (error) {
    console.log(error);
  }
};
