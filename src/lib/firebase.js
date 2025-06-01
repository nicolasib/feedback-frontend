import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_AUTH_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_GOOGLE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_GOOGLE_AUTH_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
