import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Legislation } from './app/legislation';
import * as ny from './ny/functions';

admin.initializeApp();
const db = admin.firestore();

export const test = functions.https.onRequest(async (request, response) => {
  try {
    const colRef = db.collection('legislation');
    const snapshot = await colRef.get();
    if (snapshot.empty) response.send(`no bills to update!`);

    snapshot.forEach(async (doc) => {
      const oldBill: Legislation = doc.data() as Legislation;
      const newBill: Legislation = await ny.getBillData(oldBill);
      colRef.doc(doc.id).set(newBill);
    });
  } catch (error) {
    functions.logger.error(error);
  }

  response.send(`test run completed @ ${new Date()}`);
});

export const getNewBillData = functions.firestore
  .document('legislation/{docId}')
  .onCreate(async (snapshot, context) => {
    const newBill = snapshot.data() as Legislation;
    const newBillData = await ny.getBillData(newBill);
    db.doc(`legislation/${snapshot.id}`).set(newBillData);
  });

export const updateLegislators = functions.https.onRequest(
  async (request, response) => {
    const promises: Promise<any>[] = [];
    try {
      const updatedLegislators = await ny.getUpdatedMembers();

      updatedLegislators.forEach(async (e) => {
        promises.push(db.doc(`legislators/${e.identifier}`).set(e));
      });

      await Promise.all(promises);
    } catch (error) {
      functions.logger.error(error);
    }

    response.send(`test run completed @ ${new Date()}`);
  }
);
