"use client";

import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import type { Contribution, ContributionKind } from "@/types";
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

  async approve(item: Contribution, reviewerId: string): Promise<void> {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");

    const now = new Date().toISOString();
    const publishedRef = doc(
      services.db,
      "schools",
      item.schoolId,
      "publishedContributions",
      item.id,
    );

    await setDoc(publishedRef, {
      ...item,
      status: "approved",
      publishedAt: now,
      publishedBy: reviewerId,
      reviewedAt: now,
      reviewedBy: reviewerId,
      updatedAt: now,
      updatedBy: reviewerId,
      publishedFromContributionId: item.id,
    });

    await this.update(item.id, {
      status: "approved",
      reviewedAt: now,
      reviewedBy: reviewerId,
      officialRecordRef: publishedRef.path,
      updatedAt: now,
      updatedBy: reviewerId,
    });
  }
}

export class PublishedContributionRepository {
  constructor(private readonly schoolId: string) {}

  async list(kind?: ContributionKind): Promise<Contribution[]> {
    const services = getFirebaseClient();
    if (!services) throw new Error("Firebase n'est pas configuré.");

    const reference = collection(
      services.db,
      "schools",
      this.schoolId,
      "publishedContributions",
    );

    const snapshot = await getDocs(
      kind
        ? query(reference, where("kind", "==", kind))
        : reference,
    );

    return snapshot.docs
      .map((item) => item.data() as Contribution)
      .filter((item) => item.status === "approved")
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
}
