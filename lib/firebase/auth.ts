"use client";

import {
  onAuthStateChanged,
  signInWithCustomToken,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { User } from "@/types";
import { getFirebaseClient } from "./client";

export type EcoleDirecteLoginResult =
  | { kind: "signed-in"; user: FirebaseUser }
  | { kind: "qcm"; identifiant: string; motdepasse: string; question: string; propositions: Array<{ encoded: string; label: string }> };

async function completeFirebaseLogin(payload: {
  customToken: string;
  user: {
    displayName: string;
    email: string | null;
    schoolId: string;
    schoolRne?: string;
    classId?: number;
    classCode?: string;
    className?: string;
  };
}) {
  const services = getFirebaseClient();
  if (!services) throw new Error("Firebase n'est pas configuré.");

  const credential = await signInWithCustomToken(services.auth, payload.customToken);
  if (payload.user.displayName) {
    await updateProfile(credential.user, { displayName: payload.user.displayName });
  }

  const profileRef = doc(services.db, "users", credential.user.uid);
  const existing = await getDoc(profileRef);
  const now = new Date().toISOString();

  if (!existing.exists()) {
    await setDoc(profileRef, {
      id: credential.user.uid,
      email: payload.user.email || "",
      displayName: payload.user.displayName,
      classId: payload.user.classId,
      schoolRne: payload.user.schoolRne,
      classCode: payload.user.classCode,
      className: payload.user.className,
      role: "student",
      activeSchoolIds: [payload.user.schoolId],
      createdAt: now,
      updatedAt: now,
      createdBy: credential.user.uid,
      updatedBy: credential.user.uid,
    });
  } else {
    await updateDoc(profileRef, {
      email: payload.user.email || "",
      displayName: payload.user.displayName,
      classId: payload.user.classId,
      schoolRne: payload.user.schoolRne,
      classCode: payload.user.classCode,
      className: payload.user.className,
      updatedAt: now,
      updatedBy: credential.user.uid,
    });
  }

  return credential.user;
}

export function observeAuth(callback: (user: FirebaseUser | null) => void) {
  const services = getFirebaseClient();
  return services ? onAuthStateChanged(services.auth, callback) : () => undefined;
}

export async function signIn(identifiant: string, motdepasse: string): Promise<EcoleDirecteLoginResult> {
  const response = await fetch("/api/ecoledirecte/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifiant: identifiant.trim(), motdepasse }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "La connexion EcoleDirecte a échoué.");

  if (data.requiresQcm) {
    return {
      kind: "qcm",
      identifiant,
      motdepasse,
      question: data.question,
      propositions: data.propositions,
    };
  }

  return {
    kind: "signed-in",
    user: await completeFirebaseLogin(data),
  };
}

export async function completeEcoleDirecteQcm(
  identifiant: string,
  motdepasse: string,
  choice: string,
): Promise<FirebaseUser> {
  const response = await fetch("/api/ecoledirecte/qcm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifiant, motdepasse, choice }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Le QCM EcoleDirecte a été refusé.");
  return completeFirebaseLogin(data);
}

export async function signOut() {
  const services = getFirebaseClient();
  if (services) await firebaseSignOut(services.auth);
  await fetch("/api/ecoledirecte/logout", { method: "POST" });
}

export async function getCurrentProfile(uid: string): Promise<User | null> {
  const services = getFirebaseClient();
  if (!services) return null;
  const snapshot = await getDoc(doc(services.db, "users", uid));
  return snapshot.exists() ? (snapshot.data() as User) : null;
}
