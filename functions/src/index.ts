import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as ny from './ny/functions';

admin.initializeApp();
const db = admin.firestore();

export const test = functions.https.onRequest(async (request, response) => {
  try {
  } catch (error) {
    functions.logger.error('function error', error);
  }

  response.send(`test run completed @ ${new Date()}`);
});

export const updateLegislators = functions.https.onRequest(
  async (request, response) => {
    try {
      const LegislatorsRef = db.collection('legislators');
      const updatedLegislators = await ny.getUpdatedMembers();

      updatedLegislators.forEach(async (e) => {
        const snapshot = await LegislatorsRef.where(
          'identifier',
          '==',
          e.identifier
        ).get();
        if (snapshot.empty) LegislatorsRef.add(e);
      });
    } catch (error) {
      functions.logger.error('function error', error);
    }

    response.send(`test run completed @ ${new Date()}`);
  }
);
