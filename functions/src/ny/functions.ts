import got from 'got';
import { APIKEY } from './api-key';
import * as API from './types/nysenate-api';

import type { Options } from 'got';
import type { Legislator } from '../app/legislator';

const options: Options = {
  prefixUrl: 'https://legislation.nysenate.gov',
  responseType: 'json',
  resolveBodyOnly: true,
  searchParams: new URLSearchParams([
    ['key', APIKEY],
    ['full', 'true'],
    ['limit', '1000'],
  ]),
};

export async function getUpdatedMembers() {
  try {
    const mapped: Legislator[] = [];
    const res = await got(`api/3/members?key=${APIKEY}`, options);
    if (!API.isSuccess(res)) throw new Error('API Response was Error');
    if (!API.isItemsList<API.Member>(res.result))
      throw new Error('API Response is not a List');

    res.result.items.forEach((e) => {
      mapped.push(mapToLegislator(e));
    });

    return mapped;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function mapToLegislator(m: API.Member): Legislator {
  return {
    chamber: m.chamber,
    identifier: `${m.shortName}-${m.chamber}-${m.memberId}-${m.sessionMemberId}`,
    name: m.fullName,
    sponsorships: [],
  };
}
