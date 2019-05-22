import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const addReview = functions.https.onRequest((request, response) => {
    admin.initializeApp();
    response.send("Hello from Firebase!");
});
