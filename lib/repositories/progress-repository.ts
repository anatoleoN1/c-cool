"use client";

import { doc, setDoc } from "firebase/firestore";
import type { MentalMathAttempt } from "@/types";
import { getFirebaseClient } from "@/lib/firebase/client";

export class ProgressRepository {
  constructor(private readonly userId: string) {}

  async createMentalMathAttempt(
    attempt: Omit<MentalMathAttempt, "id">,
  ): Promise<string> {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");

    const id = crypto.randomUUID();
    await setDoc(
      doc(services.db, "users", this.userId, "mentalMathAttempts", id),
      { id, ...attempt },
    );
    return id;
  }
}
