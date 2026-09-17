"use client";

import type { Contribution } from "@/types";
import { FirestoreRepository } from "./base";

export class ContributionRepository extends FirestoreRepository<Contribution> {
  constructor(schoolId: string) { super(`schools/${schoolId}/contributions`); }
}
