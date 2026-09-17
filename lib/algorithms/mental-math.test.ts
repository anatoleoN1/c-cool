import { describe, expect, it } from "vitest";
import { generateMentalMathQuestions } from "./mental-math";

describe("generateMentalMathQuestions", () => {
  it("generates the requested number of questions", () => {
    const questions = generateMentalMathQuestions({
      operations: ["addition"],
      count: 20,
      min: 1,
      max: 10,
    });

    expect(questions).toHaveLength(20);
    expect(questions.every((question) => question.operation === "addition")).toBe(true);
  });

  it("keeps subtraction answers non-negative", () => {
    const questions = generateMentalMathQuestions({
      operations: ["subtraction"],
      count: 50,
      min: 1,
      max: 20,
    });

    expect(questions.every((question) => question.answer >= 0)).toBe(true);
  });

  it("creates exact integer divisions", () => {
    const questions = generateMentalMathQuestions({
      operations: ["division"],
      count: 50,
      min: 1,
      max: 12,
    });

    expect(questions.every((question) => Number.isInteger(question.answer))).toBe(true);
    expect(questions.every((question) => question.left % question.right === 0)).toBe(true);
  });

  it("supports missing-number formats", () => {
    const questions = generateMentalMathQuestions({
      operations: ["multiplication"],
      formats: ["missing-left", "missing-right"],
      count: 10,
      min: 2,
      max: 8,
    });

    expect(questions).toHaveLength(10);
    expect(questions.some((question) => question.format === "missing-left")).toBe(true);
    expect(questions.some((question) => question.format === "missing-right")).toBe(true);
  });
});
