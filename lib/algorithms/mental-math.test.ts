import { describe, expect, it } from "vitest";
import { generateMentalMathQuestions } from "./mental-math";

describe("generateMentalMathQuestions", () => {
  it("generates the requested number of addition questions", () => {
    const questions = generateMentalMathQuestions({
      category: "addition",
      difficulty: 1,
      count: 20,
    });

    expect(questions).toHaveLength(20);
    expect(questions.every((question) => question.category === "addition")).toBe(true);
    expect(questions.every((question) => question.operation === "addition")).toBe(true);
  });

  it("keeps subtraction answers non-negative", () => {
    const questions = generateMentalMathQuestions({
      category: "subtraction",
      difficulty: 3,
      count: 50,
    });

    expect(questions.every((question) => question.answer >= 0)).toBe(true);
  });

  it("creates exact integer divisions", () => {
    const questions = generateMentalMathQuestions({
      category: "division",
      difficulty: 3,
      count: 50,
    });

    expect(questions.every((question) => Number.isInteger(question.answer))).toBe(true);
    expect(questions.every((question) => question.left % question.right === 0)).toBe(true);
  });

  it("supports the configured mental-math formats exposed by the generator", () => {
    const complements = generateMentalMathQuestions({
      category: "complements",
      difficulty: 3,
      count: 20,
    });

    expect(complements).toHaveLength(20);
    expect(complements.every((question) => question.format === "missing-right")).toBe(true);

    const divisions = generateMentalMathQuestions({
      category: "division",
      difficulty: 3,
      count: 20,
    });

    expect(divisions.every((question) => question.format === "division")).toBe(true);
  });
});
