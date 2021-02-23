import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as ny from './ny/api-functions';

import { Legislature } from './datastore-interfaces';

admin.initializeApp();
const db = admin.firestore();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const updateLegislature = functions.https.onRequest(async (req, res) => {
  const doc = await db
    .collection('legislatures')
    .doc('I4M0jPCqCVx2HttkbCfo') // TODO: refactor for Legislatures other than NY
    .get();

  if (doc.exists) {
    let lInfo: Legislature = doc.data() as Legislature;
    let members = ny.getMembers(lInfo.api, 2021);
    console.log(members);
  } else console.log("Legislature doesn't exist!");
  res.send('done');
});
