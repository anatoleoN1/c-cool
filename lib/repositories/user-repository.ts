"use client";

import { doc, updateDoc } from "firebase/firestore";
import type { User } from "@/types";
import { getFirebaseClient } from "@/lib/firebase/client";
import { FirestoreRepository } from "./base";

export class UserRepository extends FirestoreRepository<User> {
  constructor() { super("users"); }

  async updateOwnProfile(uid: string, data: Pick<User, "displayName" | "photoURL">): Promise<void> {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");
    await updateDoc(doc(services.db, "users", uid), { ...data, updatedAt: new Date().toISOString() });
  }

  async updatePreferences(
    uid: string,
    preferences: NonNullable<User["preferences"]>,
  ): Promise<void> {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");
    await updateDoc(doc(services.db, "users", uid), {
      preferences,
      updatedAt: new Date().toISOString(),
    });
  }
}
