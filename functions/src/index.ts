import * as functions from 'firebase-functions';
import {Review} from "./domain/Review";
import {validate} from "class-validator";
import firebase from './Firebase'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const addReview = functions.https.onRequest((request, response) => {
    const review: Review = new Review();
    review.postDate = new Date();
    review.author = request.body.author;
    review.target = request.body.target;
    review.content = request.body.content;
    review.isWritten = request.body.isWritten;
    review.stars = request.body.stars;

    validate(review).then(errors => {
        if (errors.length > 0) {
            response.status(400).send('Invalid json object')
        }
    }).catch(error => {
        response.status(500).send('Error parsing json')
    });

    const data = JSON.parse(JSON.stringify(review));

    firebase.firestore().collection('reviews').add(data).then(writeResult => {
        response.status(201).send();
    }).catch(err => {
        response.status(400).send(err);
    });
});

export const getReviews = functions.https.onRequest((request, response) => {
    const target = request.query.target;

    if (!target) {
        response.status(400).send('No target specified in query params')
    }

    firebase.firestore().collection('reviews')
        .where('target', '==', target)
        .get().then(snapshot => {
        if (!snapshot.empty) {
            const reviews: any = [];
            snapshot.docs.forEach(el => {
                reviews.push(el.data())
            });
            response.status(200).send(reviews);
        }

    }).catch(err => {
        response.status(400).send(err);
    })
});

