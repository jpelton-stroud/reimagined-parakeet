import got, { Options } from 'got';
import { APIKEY } from './api-key';

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
    let res = await got(`api/3/members`, options);
    console.log(res, '= response data');
  } catch (error) {
    console.error(error, '= error log');
  }
}
