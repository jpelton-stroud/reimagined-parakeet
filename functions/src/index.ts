import * as functions from 'firebase-functions';
import * as ny from './ny/functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const test = functions.https.onRequest(async (request, response) => {
  functions.logger.info(`test run started @ ${new Date()}`, {
    structuredData: true,
  });

  await ny.getUpdatedMembers();

  response.send(`test run completed @ ${new Date()}`);
});
