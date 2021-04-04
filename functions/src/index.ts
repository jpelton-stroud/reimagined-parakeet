import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Legislation } from './app/legislation';
// import { Sponsorship } from './app/shared';
import * as ny from './ny/functions';

admin.initializeApp();
const db = admin.firestore();

export const test2 = functions.https.onRequest(async (request, response) => {
  // console.log(await fn.getMembers());
  // console.log(await fn.getBill('A2681-2021'));
  // console.log(await fn.getBillSponsorshipUpdates('A2681-2021'));

  response.send('done');
});

export const test = functions.https.onRequest(async (request, response) => {
  try {
    const colRef = db.collection('legislation');
    const snapshot = await colRef.get();
    if (snapshot.empty) throw new Error(`no bills to update!`);
    else {
      snapshot.forEach(async (doc) => {
        console.log(await getBillUpdates(doc.data() as Legislation));
      });
    }
  } catch (error) {
    functions.logger.error(error);
    response.send('Run completed with errors!');
  }

  response.send('Run completed successfully');
});

function getBillUpdates(bill: Legislation) {
  return ny.getBillSponsorshipUpdates(bill.identifier);
}
