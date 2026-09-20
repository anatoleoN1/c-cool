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

  // En production sur Firebase App Hosting, Google fournit
  // automatiquement les Application Default Credentials.
  if (!projectId || !clientEmail || !privateKey) {
    return initializeApp();
  }

  // En développement local, on continue d'utiliser le compte de service
  // configuré dans .env.local.
  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());
export const adminStorage = () => getStorage(getAdminApp());
export async function refreshEcoleDirecteClaims(input: {
  uid: string;
  schoolId: string;
  schoolRne?: string;
  edStudentId: string;
  edAccountType: string;
  accessGranted: boolean;
  role: "student" | "moderator" | "admin";
}) {
  await adminAuth().setCustomUserClaims(input.uid, {
    role: input.role,
    schoolId: input.schoolId,
    edStudentId: input.edStudentId,
    edAccountType: input.edAccountType,
    ...(input.schoolRne ? { schoolRne: input.schoolRne } : {}),
    accessGranted: input.accessGranted || input.role !== "student",
  });
}


export async function createEcoleDirecteCustomToken(
  uid: string,
  schoolId: string,
  edStudentId: string,
  edAccountType: string,
  accessGranted: boolean,
  role: "student" | "moderator" | "admin",
  schoolRne?: string,
) {
  const auth = adminAuth();

  // Les variables .env sont la source d'autorité pour les rôles.
  // Elles sont réévaluées à chaque nouvelle connexion.
  // Si un ID est retiré de .env.local, il redevient donc élève
  // lors de la prochaine connexion.
  const customClaims = {
    role,
    schoolId,
    ...(schoolRne ? { schoolRne } : {}),
    edStudentId,
    edAccountType,
    accessGranted: accessGranted || role !== "student",
  };

  // Le profil Firestore est synchronisé côté serveur : le client
  // ne peut donc pas s'auto-promouvoir en administrateur/modérateur.
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
