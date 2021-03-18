import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Legislation } from './app/legislation';
import { Sponsorship } from './app/shared';
import * as ny from './ny/functions';

admin.initializeApp();
const db = admin.firestore();

export const test = functions.https.onRequest(async (request, response) => {
  // try {
  //   const colRef = db.collection('legislation');
  //   const snapshot = await colRef.get();
  //   if (snapshot.empty) throw new Error(`no bills to update!`);
  //   else {
  //     snapshot.forEach(async (doc) => {
  //       const bill: Legislation = doc.data() as Legislation;
  //       const billData: Legislation = await ny.getBillData(bill);

  //       const sponsorship: Sponsorship = {
  //         name: bill.name,
  //         identifier: bill.identifier,
  //         version: billData.version,
  //         date: '',
  //       };

  //       await batchSponsorshipUpdates(billData.sponsorships, sponsorship);
  //       await colRef.doc(doc.id).set(billData);
  //     });
  //   }
  // } catch (error) {
  //   functions.logger.error(error);
  // }

  response.send(`test run completed @ ${new Date()}`);
});

function batchSponsorshipUpdates(
  sponsorList: Sponsorship[],
  data: Sponsorship
): Promise<any> {
  const sponsorBatch = db.batch();
  sponsorList.forEach((sponsor) => {
    sponsorBatch.update(db.doc(`legislators/${sponsor.identifier}`), {
      sponsorships: admin.firestore.FieldValue.arrayUnion(data),
    });
  });

  return sponsorBatch.commit();
}

export const updateBills = functions.pubsub
  .schedule('every 3 hours from 06:00 to 19:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    try {
      const colRef = db.collection('legislation');
      const snapshot = await colRef.get();
      if (snapshot.empty) throw new Error(`no bills to update!`);
      else {
        snapshot.forEach(async (doc) => {
          const bill: Legislation = doc.data() as Legislation;
          const billData: Legislation = await ny.getBillData(bill);

          const sponsorship: Sponsorship = {
            name: bill.name,
            identifier: bill.identifier,
            version: billData.version,
            date: '',
          };

          await batchSponsorshipUpdates(billData.sponsorships, sponsorship);
          await colRef.doc(doc.id).set(billData);
        });
      }
    } catch (error) {
      functions.logger.error(error);
    }
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
      const batch = db.batch();
      const updatedLegislators = await ny.getUpdatedMemberList();

      updatedLegislators.forEach(async (e) => {
        batch.set(db.doc(`legislators/${e.identifier}`), e);
      });

      await batch.commit();
      response.send(`Legislator update completed @ ${new Date()}`);
    } catch (error) {
      functions.logger.error(error);
      response.send(
        `Legislator update completed with error "${error}" @ ${new Date()}`
      );
    }
  }
);

export const forceBillUpdates = functions.https.onRequest(
  async (request, response) => {
    try {
      const snapshot = await db.collection('legislation').get();
      if (snapshot.empty) throw new Error('nothing to update!');
      else {
        snapshot.forEach(async (billRef) => {
          const bill: Legislation = billRef.data() as Legislation;
          const data: Legislation = await ny.getBillData(bill);
          const sponsorship: Sponsorship = {
            name: bill.name,
            identifier: bill.identifier,
            version: data.version,
            date: '',
          };
          await batchSponsorshipUpdates(data.sponsorships, sponsorship);
          await db.collection('legislation').doc(billRef.id).set(data);
          response.send(`forced bill update completed @ ${new Date()}`);
        });
      }
    } catch (error) {
      functions.logger.error(error);
      response.send(
        `forced bill update completed with error "${error}" @ ${new Date()}`
      );
    }
  }
);
