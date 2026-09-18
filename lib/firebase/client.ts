"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  type AppCheck,
} from "firebase/app-check";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage, type FirebaseStorage } from "firebase/storage";

export interface FirebaseClientServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
  appCheck: AppCheck | null;
}

const requiredConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const appCheckKey = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_KEY;

export function isFirebaseConfigured(): boolean {
  return Object.values(requiredConfig).every(Boolean);
}

let emulatorConnected = false;
let appCheckInstance: AppCheck | null = null;

function initializeClientAppCheck(app: FirebaseApp): AppCheck | null {
  if (typeof window === "undefined" || !appCheckKey) return null;
  if (appCheckInstance) return appCheckInstance;

  const isLocalDevelopment =
    process.env.NODE_ENV === "development" &&
    window.location.hostname === "localhost";

  if (isLocalDevelopment) {
    const debugScope = globalThis as typeof globalThis & {
      FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean;
    };
    debugScope.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  appCheckInstance = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckKey),
    isTokenAutoRefreshEnabled: true,
  });

  return appCheckInstance;
}

export function getFirebaseClient(): FirebaseClientServices | null {
  if (!isFirebaseConfigured()) return null;

  const app = getApps().length ? getApp() : initializeApp(requiredConfig);
  const appCheck = initializeClientAppCheck(app);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" && !emulatorConnected) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
    emulatorConnected = true;
  }

  return { app, auth, db, storage, appCheck };
}
