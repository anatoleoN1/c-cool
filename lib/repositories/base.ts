"use client";

import { addDoc, collection, doc, getDoc, getDocs, updateDoc, type DocumentData } from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase/client";

export class FirestoreRepository<T extends { id: string }> {
  constructor(protected readonly path: string) {}

  protected database() {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");
    return services.db;
  }

  async get(id: string): Promise<T | null> {
    const snapshot = await getDoc(doc(this.database(), this.path, id));
    return snapshot.exists() ? (snapshot.data() as T) : null;
  }

  async list(): Promise<T[]> {
    const snapshot = await getDocs(collection(this.database(), this.path));
    return snapshot.docs.map((item) => item.data() as T);
  }

  async create(data: Omit<T, "id">): Promise<string> {
    const reference = await addDoc(collection(this.database(), this.path), data as DocumentData);
    await updateDoc(reference, { id: reference.id });
    return reference.id;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await updateDoc(doc(this.database(), this.path, id), data as DocumentData);
  }
}
