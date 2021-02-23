import got from 'got';
import { ApiConfigBlock } from '../datastore-interfaces';

export const getMembers = async (api: ApiConfigBlock, session: number) => {
  const request =
    api.baseURI +
    api.memberEndpoint +
    `/${session}?limit=1000&full=true&key=${api.key}`;

  try {
    const response = await got(request);
    console.log(response.body);
  } catch (error) {
    console.log('NY getMembers failed!\n\n', error);
  }

  return 0;
};
