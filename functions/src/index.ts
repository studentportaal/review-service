import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Review} from "./domain/Review";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const addReview = functions.https.onRequest((request, response) => {
    admin.initializeApp();
    const review: Review = request.body;

    if (review.postDate == undefined) {
        review.postDate = new Date();
    }

    admin.firestore().collection('reviews').add(review).then(writeResult => {
        response.status(201).send(writeResult);
    }).catch(err => {
        response.status(400).send(err);
    });
});

export const getReviews = functions.https.onRequest((request, response) => {
    admin.initializeApp();
    const target = request.query.target;

    if (!target) {
        response.status(400).send('No target specified in query params')
    }

    admin.firestore().collection('reviews')
        .where('target', '==', target)
        .get().then(snapshot => {
        if (!snapshot.empty) {
            let reviews: any = [];
            snapshot.docs.forEach(el => {
                reviews.push(el.data())
            });
            response.status(200).send(reviews);
        }

    }).catch(err => {
        response.status(400).send(err);
    })
});

