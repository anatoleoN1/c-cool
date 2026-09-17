import type { Correction } from "@/types";

export function correctionConfidence(correction: Pick<Correction, "authorRole" | "verificationStatus">): number {
  if (correction.verificationStatus === "verified") {
    return correction.authorRole === "teacher" || correction.authorRole === "admin" ? 1 : 0.9;
  }
  return correction.authorRole === "moderator" ? 0.65 : 0.4;
}
