import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Legislation } from './app/legislation';
import { Sponsorship } from './app/shared';
import * as ny from './ny/functions';

admin.initializeApp();
const db = admin.firestore();

export const test = functions.https.onRequest(async (request, response) => {
  try {
    const colRef = db.collection('legislation');
    const snapshot = await colRef.get();
    if (snapshot.empty) throw new Error(`no bills to update!`);

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
    try {
      const bill = snapshot.data() as Legislation;
      const billData = await ny.getBillData(bill);
      const promises: Promise<any>[] = [
        db.doc(`legislation/${snapshot.id}`).set(billData),
      ];

      const sponsorship: Sponsorship = {
        name: bill.name,
        identifier: bill.identifier,
        version: billData.version,
        date: '',
      };

      billData.sponsorships.forEach((sponsor: Sponsorship) => {
        const id: string = `legislators/${sponsor.identifier}`;
        promises.push(updateSponsorships(id, sponsorship));
      });

      await Promise.all(promises);
    } catch (error) {
      functions.logger.error(error);
    }
  });

async function updateSponsorships(
  id: string,
  sponsorship: Sponsorship
): Promise<any> {
  return db.doc(id).update({
    sponsorships: admin.firestore.FieldValue.arrayUnion(sponsorship),
  });
}

export const updateLegislators = functions.https.onRequest(
  async (request, response) => {
    try {
      const promises: Promise<any>[] = [];
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
