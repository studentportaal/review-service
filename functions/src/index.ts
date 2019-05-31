import * as functions from 'firebase-functions';
import {Review} from "./domain/Review";
import {validate} from "class-validator";
import firebase from './Firebase'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const addReview = functions.https.onRequest((request, response) => {

    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Headers', '*');
    response.set('Access-Control-Allow-Methods', '*');

    const review: Review = new Review();
    review.postDate = new Date();
    review.author = request.body.author;
    review.target = request.body.target;
    review.content = request.body.content;
    review.written = request.body.written;
    review.stars = request.body.stars;

    validate(review).then(errors => {
        if (errors.length > 0) {
            response.status(400).send('Invalid json object')
        } else {
            const data = JSON.parse(JSON.stringify(review));

            firebase.firestore().collection('reviews').add(data).then(writeResult => {
                response.status(201).send();
            }).catch(err => {
                response.status(400).send(err);
            });
        }
    }).catch(error => {
        response.status(500).send('Error parsing json')
    });
});

export const getReviews = functions.https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Headers', '*');
    response.set('Access-Control-Allow-Methods', '*');

    const target: string = request.query.target;
    const author: string = request.query.author;
    const written: boolean = JSON.parse(request.query.written);

    let query: any = firebase.firestore().collection('reviews');

    if (target) {
        query = query.where('target', '==', target);
    }

    if (author) {
        query = query.where('author', '==', author);
    }

    if (written !== null && written !== undefined) {
        query = query.where('written', '==', written);
    }

    if(query) {
        query.get()
            .then((snapshot: any)  => {
                if (!snapshot.empty) {
                    const reviews: any = [];
                    snapshot.docs.forEach((el: any) => {
                        const review = el.data();
                        review.id = el.id;
                        reviews.push(review)
                    });
                    response.status(200).send(reviews);
                } else {
                    response.status(404).send();
                }

            }).catch((err: any) => {
            response.status(400).send(err);
        })
    }
});

export const updateReview = functions.https.onRequest((request, response) => {

    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Headers', '*');
    response.set('Access-Control-Allow-Methods', '*');

    console.log(request.body);

    const id = request.body.id;
    const review: Review = new Review();
    review.postDate = new Date();
    review.author = request.body.author;
    review.target = request.body.target;
    review.content = request.body.content;
    review.written = request.body.written;
    review.stars = request.body.stars;

    console.log(review);

    validate(review).then(errors => {
        if (errors.length > 0) {
            response.status(400).send('Invalid json object')
        } else {
            const data = JSON.parse(JSON.stringify(review));

            firebase.firestore().collection('reviews').doc(id).set(data).then(() => {
                response.status(204).send();
            }).catch(err => {
                response.status(400).send(err);
            });
        }
    }).catch(error => {
        response.status(500).send('Error parsing json')
    });
});

