import admin from 'firebase-admin';
import config from './env.js';

const FIREBASE_PROJECT_ID = config.firebase.projectId;
const FIREBASE_CLIENT_EMAIL = config.firebase.clientEmail;
const FIREBASE_PRIVATE_KEY = config.firebase.privateKey;

if (!admin.apps.length) {
    if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: FIREBASE_PROJECT_ID,
                    clientEmail: FIREBASE_CLIENT_EMAIL,
                    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
            console.log('Firebase Admin: initialized for project', FIREBASE_PROJECT_ID);
        } catch (err) {
            console.error('Firebase Admin: initialization failed:', err.message);
        }
    } else {
        console.warn(
            'Firebase Admin: initialization skipped — FIREBASE_SERVICE_ACCOUNT_PROJECT_ID, ' +
            'FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL or FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY is not set'
        );
    }
}

export const firebaseAdmin = admin;
export const firebaseAuth = admin.apps.length ? admin.auth() : null;
