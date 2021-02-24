import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as ny from './ny/api-functions';

import { Legislature } from './datastore-interfaces';

admin.initializeApp();
const db = admin.firestore();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const updateNyLegislators = functions.https.onRequest(
  async (req, res) => {
    const legislatureDocRef = db
      .collection('legislatures')
      .doc('I4M0jPCqCVx2HttkbCfo');

    const legislatureDoc = await legislatureDocRef.get();

    if (legislatureDoc.exists) {
      const legislatureData: Legislature = legislatureDoc.data() as Legislature;
      const members = await ny.getMembers(legislatureData.api, 2021);
      members.forEach(
        async (e) => await legislatureDocRef.collection('legislators').add(e)
      );
      res.send('NY legislature update successful');
    } else {
      console.log("Legislature doesn't exist!");
      res.send('NY legislature update failed');
    }
  }
);
