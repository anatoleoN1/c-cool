"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  type AppCheck,
} from "firebase/app-check";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";

export interface FirebaseClientServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
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
  const explicitConfig = Object.values(requiredConfig).every(Boolean);

  // En production sur Firebase App Hosting, le SDK Firebase Web
  // peut être initialisé automatiquement par l'environnement.
  return explicitConfig || process.env.NODE_ENV === "production";
}

let emulatorConnected = false;
let appCheckInstance: AppCheck | null = null;

function initializeClientAppCheck(app: FirebaseApp): AppCheck | null {
  if (typeof window === "undefined" || !appCheckKey) return null;
  if (appCheckInstance) return appCheckInstance;

  /*
   * En développement, C-Cool peut être ouvert depuis le Raspberry Pi
   * via son IP LAN (ex. 192.168.x.x). Une clé reCAPTCHA Enterprise
   * configurée pour Firebase App Check ne valide pas forcément cette
   * origine. On désactive donc App Check par défaut en développement.
   *
   * Pour le tester volontairement en dev :
   * NEXT_PUBLIC_FIREBASE_APPCHECK_IN_DEV=true
   */
  const appCheckInDevelopment =
    process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_IN_DEV === "true";

  if (process.env.NODE_ENV === "development" && !appCheckInDevelopment) {
    return null;
  }

  if (process.env.NODE_ENV === "development") {
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

  const hasExplicitConfig = Object.values(requiredConfig).every(Boolean);
  const app = getApps().length
    ? getApp()
    : hasExplicitConfig
      ? initializeApp(requiredConfig)
      : initializeApp();
  const appCheck = initializeClientAppCheck(app);
  const auth = getAuth(app);
  const db = getFirestore(app);

  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" && !emulatorConnected) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    emulatorConnected = true;
  }

  return { app, auth, db, appCheck };
}
