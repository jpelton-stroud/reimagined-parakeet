import got, { Options } from 'got';

import { APIKEY } from './api-key';
import * as API from './types/nysenate-api';
import { Legislator } from '../app/legislator';
import { Legislation } from '../app/legislation';
import { Sponsorship } from '../app/shared';

const options: Options = {
  prefixUrl: 'https://legislation.nysenate.gov',
  responseType: 'json',
  resolveBodyOnly: true,
};

export async function getUpdatedMemberList() {
  options.searchParams = `key=${APIKEY}&full=true&limit=1000`;
  try {
    const mapped: Legislator[] = [];
    const res = await got(`api/3/members/${new Date().getFullYear()}`, options);
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
    identifier: generateMemberId(m),
    name: m.fullName,
    updated_at: new Date().toISOString(),
    sponsorships: [],
  };
}

function generateMemberId(m: API.Member): string {
  return `${m.shortName}-${m.chamber}-${m.memberId}-${m.sessionMemberId}`;
}

export async function getBillData(oldBill: Legislation) {
  options.searchParams = `key=${APIKEY}`;

  const idParts = oldBill.identifier.split('-');
  const apiPath = `api/3/bills/${idParts.pop()}/${idParts.pop()}`;
  try {
    const res = await got(apiPath, options);
    if (!API.isSuccess(res)) throw new Error('API Response was Error');
    if (!API.isBill(res.result)) throw new Error('API Response not a bill');
    return mapToLegislation(res.result, oldBill.name);
  } catch (error) {
    console.error(error);
    throw new Error('API Call failed');
  }
}

function mapToLegislation(e: API.Bill, n: string): Legislation {
  const sponsors: Sponsorship[] = [
    mapToSponsorship(e.sponsor.member, e.activeVersion),
  ];
  e.amendments.items[e.activeVersion].coSponsors.items.forEach((e2) => {
    sponsors.push(mapToSponsorship(e2, e.activeVersion));
  });
  return {
    updated_at: new Date().toISOString(),
    creator_id: generateMemberId(e.sponsor.member),
    identifier: e.basePrintNoStr,
    title: e.title,
    sponsorships: sponsors,
    name: n,
    version: e.activeVersion,
  };
}

function mapToSponsorship(e: API.Member, v: string): Sponsorship {
  return {
    date: new Date().toISOString(),
    identifier: generateMemberId(e),
    name: e.fullName,
    version: v,
  };
}
