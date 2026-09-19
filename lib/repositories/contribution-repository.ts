"use client";

import { collection, doc, setDoc } from "firebase/firestore";
import type { Contribution } from "@/types";
import { getFirebaseClient } from "@/lib/firebase/client";
import { FirestoreRepository } from "./base";

export class ContributionRepository extends FirestoreRepository<Contribution> {
  constructor(schoolId: string) {
    super(`schools/${schoolId}/contributions`);
  }

  async createPending(data: Omit<Contribution, "id">): Promise<string> {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");

    const ref = doc(collection(services.db, this.path));
    const id = ref.id;
    await setDoc(ref, { id, ...data });
    return id;
  }
}
