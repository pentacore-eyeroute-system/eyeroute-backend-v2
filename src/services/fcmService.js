/*
    FCM: New service added for push notifications.

    Wraps firebase-admin so the rest of the backend can send a push without
    knowing anything about Firebase. Delivery is best effort by design: a failed
    push must never fail the request that triggered it, because the notification
    has already been written to the database and broadcast over the websocket.
*/
import admin from "firebase-admin";
import config from "../config/env.js";

const FIREBASE_PROJECT_ID = config.fcm.projectId;
const FIREBASE_CLIENT_EMAIL = config.fcm.clientEmail;
const FIREBASE_PRIVATE_KEY = config.fcm.privateKey;

/*
    Initialised lazily and once. If the credentials are absent the service stays
    disabled and every send becomes a no-op, so a deployment without Firebase
    configured keeps working exactly as it did before FCM was added.
*/
let messaging = null;
let initialisationAttempted = false;

function getMessaging() {
    if (initialisationAttempted) {
        return messaging;
    }

    initialisationAttempted = true;

    if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
        console.warn(
            'FCM: push notifications disabled — FIREBASE_PROJECT_ID, ' +
            'FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY is not set'
        );
        return null;
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: FIREBASE_PROJECT_ID,
                clientEmail: FIREBASE_CLIENT_EMAIL,
                /*
                    Env vars cannot hold real newlines, so the private key is
                    stored with literal "\n" sequences and expanded here.
                */
                privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });

        messaging = admin.messaging();

        console.log('FCM: initialised for project', FIREBASE_PROJECT_ID);
    } catch (err) {
        console.error('FCM: initialisation failed:', err.message);
        messaging = null;
    }

    return messaging;
}

export class FcmService {
    /*
        Sends one notification to many devices.

        The payload carries BOTH a `notification` block and a `data` block on
        purpose:
          - `notification` is what lets the OS display the alert by itself while
            the app is backgrounded or closed (a data-only message is never
            shown by the system and would defeat the point of this feature);
          - `data` carries the ids the app uses to open the right screen when the
            notification is tapped.

        Returns the tokens FCM rejected as permanently invalid, so the caller can
        delete them.
    */
    async sendToTokens(tokens, { title, body, data }) {
        const client = getMessaging();

        if (!client || !tokens || tokens.length === 0) {
            return { sent: 0, invalidTokens: [] };
        }

        const message = {
            tokens,
            notification: { title, body },
            data: {
                ...data,
                /*
                    Required by the Flutter client so a tapped notification is
                    routed through firebase_messaging's onMessageOpenedApp.
                */
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
            },
            android: {
                priority: 'high',
                notification: {
                    /*
                        Must match the channel the Flutter app creates, or
                        Android 8+ silently drops the notification.
                    */
                    channelId: 'eyeroute_device_alerts',
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        // Lets iOS show the alert while the app is not running.
                        contentAvailable: true,
                    },
                },
            },
        };

        try {
            const response = await client.sendEachForMulticast(message);

            const invalidTokens = [];

            response.responses.forEach((result, index) => {
                if (result.success) {
                    return;
                }

                const code = result.error?.code ?? '';

                /*
                    Only these two mean the token will never work again. Other
                    failures (quota, transport) are transient and the token is
                    kept so the next notification can retry it.
                */
                if (
                    code === 'messaging/registration-token-not-registered' ||
                    code === 'messaging/invalid-registration-token'
                ) {
                    invalidTokens.push(tokens[index]);
                }

                console.error('FCM: send failed for one token:', code);
            });

            return { sent: response.successCount, invalidTokens };
        } catch (err) {
            // Best effort: never propagate: the DB row and websocket already went out.
            console.error('FCM: send threw:', err.message);
            return { sent: 0, invalidTokens: [] };
        }
    };
}
