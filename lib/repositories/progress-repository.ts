"use client";

import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import type { Progress, RevisionPlan } from "@/types";
import { getFirebaseClient } from "@/lib/firebase/client";

export class ProgressRepository {
  constructor(private readonly userId: string) {}

  async listChapterProgress(): Promise<Progress[]> {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");
    const snapshot = await getDocs(collection(services.db, "users", this.userId, "progress"));
    return snapshot.docs.map((item) => item.data() as Progress);
  }

  async upsertChapterProgress(
    chapterId: string,
    data: Omit<Progress, "chapterId" | "userId">,
  ): Promise<void> {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");
    await setDoc(
      doc(services.db, "users", this.userId, "progress", chapterId),
      { userId: this.userId, chapterId, ...data },
      { merge: true },
    );
  }

  async createMentalMathAttempt(attempt: Omit<import("@/types").MentalMathAttempt, "id">): Promise<string> {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");
    const id = crypto.randomUUID();
    await setDoc(doc(services.db, "users", this.userId, "mentalMathAttempts", id), { id, ...attempt });
    return id;
  }

  async saveRevisionPlan(plan: Omit<RevisionPlan, "id">): Promise<string> {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");
    const id = crypto.randomUUID();
    await setDoc(doc(services.db, "users", this.userId, "revisionPlans", id), { id, ...plan });
    return id;
  }
}
