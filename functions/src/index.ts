import * as functions from 'firebase-functions';
// import * as ny from './ny/functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const test = functions.https.onRequest(async (request, response) => {
  // functions.logger.info(`test begins`, {
  //   structuredData: true,
  // });

  // try {
  //   const data = await ny.getUpdatedMembers();

  //   functions.logger.debug('', data);
  //   functions.logger.info(`try block`, {
  //     structuredData: true,
  //   });
  // } catch (error) {
  //   functions.logger.info(`catch block`, {
  //     structuredData: true,
  //   });

  //   functions.logger.error('function error', error);
  // }

  response.send(`test run completed @ ${new Date()}`);
});
