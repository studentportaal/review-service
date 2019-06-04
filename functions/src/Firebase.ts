import * as firebase from 'firebase-admin';


export default !firebase.apps.length ? firebase.initializeApp() : firebase.app();
