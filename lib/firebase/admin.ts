import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Les identifiants Firebase Admin sont absents côté serveur.");
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());
export const adminStorage = () => getStorage(getAdminApp());


export async function createEcoleDirecteCustomToken(
  uid: string,
  schoolId: string,
  edStudentId: string,
  edAccountType: string,
  accessGranted: boolean,
  isAdmin: boolean,
) {
  const auth = adminAuth();
  let role: "student" | "moderator" | "admin" = "student";

  try {
    const existing = await auth.getUser(uid);
    const existingRole = existing.customClaims?.role;
    if (existingRole === "moderator" || existingRole === "admin") {
      role = existingRole;
    }
  } catch {
    // Premier accès : le rôle par défaut est élève.
  }

  if (isAdmin) {
    role = "admin";
  }

  const customClaims = {
    role,
    schoolId,
    edStudentId,
    edAccountType,
    accessGranted: accessGranted || role === "admin",
  };

  // Le profil Firestore est synchronisé côté serveur : le client
  // ne peut donc pas s'auto-promouvoir en administrateur.
  await adminDb().collection("users").doc(uid).set(
    {
      id: uid,
      role,
      activeSchoolIds: [schoolId],
      updatedAt: new Date().toISOString(),
      updatedBy: uid,
      createdBy: uid,
    },
    { merge: true },
  );

  return auth.createCustomToken(uid, customClaims);
}
