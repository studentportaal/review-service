import * as functions from 'firebase-functions';
import {Review} from "./domain/Review";
import {validate} from "class-validator";
import firebase from './Firebase'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const addReview = functions.region('europe-west1').https.onRequest((request, response) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', request.header('Access-Control-Request-Headers'));
    response.header('Access-Control-Allow-Methods', request.header('Access-Control-Request-Method'));

    if (request.method === 'OPTIONS') {
        response.status(204).send();
    } else if (request.method === 'POST') {
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
    }
});

export const getReviews = functions.region('europe-west1').https.onRequest((request, response) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', request.header('Access-Control-Request-Headers'));
    response.header('Access-Control-Allow-Methods', request.header('Access-Control-Request-Method'));

    if (request.method === 'OPTIONS') {
        response.status(204).send();
    } else if (request.method === 'GET') {
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

        if (query) {
            query.get()
                .then((snapshot: any) => {
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
    }

});

export const updateReview = functions.region('europe-west1').https.onRequest((request, response) => {

    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', request.header('Access-Control-Request-Headers'));
    response.header('Access-Control-Allow-Methods', request.header('Access-Control-Request-Method'));

    if (request.method === 'OPTIONS') {
        response.status(204).send();
    } else if (request.method === 'PUT') {
        const id = request.body.id;
        const data = {
            "content": request.body.content,
            "written": request.body.written,
            "stars": request.body.stars
        };

        firebase.firestore().collection('reviews').doc(id).set(data, {merge: true}).then(() => {
            response.status(204).send();
        }).catch((err) => response.status(400).send())

    }
});

