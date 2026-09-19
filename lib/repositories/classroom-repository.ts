"use client";

import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import type { ClassMessage } from "@/types";
import { getFirebaseClient } from "@/lib/firebase/client";

export class ClassMessageRepository {
  constructor(private readonly schoolId: string) {}

  async list(): Promise<ClassMessage[]> {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");

    const snapshot = await getDocs(
      collection(services.db, "schools", this.schoolId, "classMessages"),
    );

    return snapshot.docs
      .map((item) => item.data() as ClassMessage)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async create(data: Omit<ClassMessage, "id">): Promise<string> {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");

    const ref = doc(collection(services.db, "schools", this.schoolId, "classMessages"));
    await setDoc(ref, { id: ref.id, ...data });
    return ref.id;
  }
}
