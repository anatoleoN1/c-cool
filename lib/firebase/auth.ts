"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "@/types";
import { getFirebaseClient } from "./client";

export function observeAuth(callback: (user: FirebaseUser | null) => void) {
  const services = getFirebaseClient();
  return services ? onAuthStateChanged(services.auth, callback) : () => undefined;
}

export async function signIn(email: string, password: string) {
  const services = getFirebaseClient();
  if (!services) throw new Error("Firebase n'est pas configuré.");
  return signInWithEmailAndPassword(services.auth, email.trim(), password);
}

export async function signUp(displayName: string, email: string, password: string) {
  const services = getFirebaseClient();
  if (!services) throw new Error("Firebase n'est pas configuré.");

  const credential = await createUserWithEmailAndPassword(services.auth, email.trim(), password);
  await updateProfile(credential.user, { displayName: displayName.trim() });
  await setDoc(doc(services.db, "users", credential.user.uid), {
    id: credential.user.uid,
    email: credential.user.email,
    displayName: displayName.trim(),
    role: "student",
    activeSchoolIds: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: credential.user.uid,
    updatedBy: credential.user.uid,
  });
  return credential;
}

export async function signOut() {
  const services = getFirebaseClient();
  if (services) await firebaseSignOut(services.auth);
}

export async function getCurrentProfile(uid: string): Promise<User | null> {
  const services = getFirebaseClient();
  if (!services) return null;
  const snapshot = await getDoc(doc(services.db, "users", uid));
  return snapshot.exists() ? (snapshot.data() as User) : null;
}
