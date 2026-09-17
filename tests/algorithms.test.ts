import { describe, expect, it } from "vitest";
import { normalizeContributionText, tokenSimilarity } from "@/lib/algorithms/similarity";
import { scheduleNextReview } from "@/lib/algorithms/spaced-repetition";
import { generateRevisionSessions } from "@/lib/algorithms/revision-plan";
import { correctionConfidence } from "@/lib/domain/confidence";

describe("normalisation et similarité", () => {
  it("normalise accents et ponctuation", () => {
    expect(normalizeContributionText("Exercice 12 : sauf question C !")).toBe("exercice 12 sauf question c");
  });
  it("rapproche des propositions semblables", () => {
    expect(tokenSimilarity("Exercice 12 sauf c", "exercice 12 - sauf question c")).toBeGreaterThan(0.5);
  });
});

describe("répétition et confiance", () => {
  it("réinitialise une réponse insuffisante", () => {
    expect(scheduleNextReview({ intervalDays: 10, ease: 2.5, repetitions: 4 }, 2).repetitions).toBe(0);
  });
  it("favorise une correction vérifiée d'un professeur", () => {
    expect(correctionConfidence({ authorRole: "teacher", verificationStatus: "verified" })).toBeGreaterThan(correctionConfidence({ authorRole: "student", verificationStatus: "unverified" }));
  });
});

describe("planification", () => {
  it("priorise les chapitres faibles", () => {
    const plan = generateRevisionSessions({ assessmentDate: "2027-01-10", today: "2027-01-01", chapterIds: ["a", "b"], weakChapterIds: ["b"], difficulty: 3 });
    expect(plan.find((session) => session.chapterId === "b")?.priority).toBe("high");
  });
});
