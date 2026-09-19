export type MentalMathCategory =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "complements"
  | "decimals"
  | "fractions"
  | "percentages"
  | "powers"
  | "signed"
  | "priorities"
  | "mixed";

export type MentalMathOperation = "addition" | "subtraction" | "multiplication" | "division";
export type MentalMathFormat = "direct" | "missing-left" | "missing-right" | "division";

export type MentalMathQuestion = {
  id: string;
  category: MentalMathCategory;
  operation: MentalMathOperation;
  format: MentalMathFormat;
  left: number;
  right: number;
  answer: number;
  text: string;
};

export type MentalMathConfig = {
  category: MentalMathCategory;
  difficulty?: number;
  count?: number;
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSigned(max: number) {
  const value = randomInt(1, Math.max(1, max));
  return Math.random() < 0.5 ? -value : value;
}

function fractionQuestion(difficulty: number) {
  const max = difficulty >= 4 ? 12 : difficulty >= 2 ? 9 : 6;
  const a = randomInt(1, max);
  const b = randomInt(1, max);
  const c = randomInt(1, max);
  const d = randomInt(1, max);
  const den = b * d;
  const answer = (a * d + c * b) / den;
  return { left: a / b, right: c / d, answer, text: `${a}/${b} + ${c}/${d} = ?`, operation: "addition" as const };
}

function makeQuestion(category: MentalMathCategory, difficulty: number, index: number): MentalMathQuestion {
  const scale = Math.min(100, 10 + difficulty * 15);
  let left = randomInt(1, scale);
  let right = randomInt(1, scale);
  let answer = 0;
  let text = "";
  let operation: MentalMathOperation = "addition";
  let format: MentalMathFormat = "direct";

  if (category === "mixed") {
    const choices: MentalMathCategory[] = ["addition", "subtraction", "multiplication", "division", "complements", "decimals", "percentages", "powers", "signed", "priorities"];
    category = choices[randomInt(0, choices.length - 1)];
  }

  switch (category) {
    case "addition":
      operation = "addition";
      left = randomInt(1, difficulty >= 4 ? 999 : difficulty >= 2 ? 99 : 20);
      right = randomInt(1, difficulty >= 4 ? 999 : difficulty >= 2 ? 99 : 20);
      answer = left + right;
      text = `${left} + ${right} = ?`;
      break;
    case "subtraction":
      operation = "subtraction";
      left = randomInt(1, difficulty >= 4 ? 999 : difficulty >= 2 ? 99 : 20);
      right = randomInt(1, left);
      answer = left - right;
      text = `${left} − ${right} = ?`;
      break;
    case "multiplication":
      operation = "multiplication";
      left = randomInt(2, difficulty >= 4 ? 99 : difficulty >= 3 ? 20 : 12);
      right = randomInt(2, difficulty >= 4 ? 20 : 12);
      answer = left * right;
      text = `${left} × ${right} = ?`;
      break;
    case "division":
      operation = "division";
      right = randomInt(2, difficulty >= 4 ? 20 : 12);
      answer = randomInt(2, difficulty >= 4 ? 50 : 20);
      left = right * answer;
      format = "division";
      text = `${left} ÷ ${right} = ?`;
      break;
    case "complements": {
      operation = "addition";
      const base = difficulty >= 4 ? 1000 : difficulty >= 3 ? 100 : 10;
      left = randomInt(1, base - 1);
      right = base - left;
      answer = right;
      text = `${left} + ? = ${base}`;
      format = "missing-right";
      break;
    }
    case "decimals": {
      operation = "addition";
      const factor = difficulty >= 4 ? 100 : 10;
      left = randomInt(1, 99) / factor;
      right = randomInt(1, 99) / factor;
      answer = Number((left + right).toFixed(2));
      text = `${left.toString().replace(".", ",")} + ${right.toString().replace(".", ",")} = ?`;
      break;
    }
    case "fractions": {
      const q = fractionQuestion(difficulty);
      left = q.left;
      right = q.right;
      answer = q.answer;
      text = q.text;
      operation = q.operation;
      break;
    }
    case "percentages": {
      const percentages = difficulty >= 4 ? [5, 10, 12.5, 15, 20, 25, 30, 50] : [10, 20, 25, 50];
      const percent = percentages[randomInt(0, percentages.length - 1)];
      const base = randomInt(2, difficulty >= 4 ? 400 : 100);
      left = percent;
      right = base;
      answer = Number(((percent / 100) * base).toFixed(2));
      text = `${percent}% de ${base} = ?`;
      break;
    }
    case "powers": {
      const exponent = difficulty >= 4 ? randomInt(2, 4) : 2;
      const base = randomInt(2, difficulty >= 4 ? 12 : 10);
      left = base;
      right = exponent;
      answer = base ** exponent;
      text = `${base}^${exponent} = ?`;
      break;
    }
    case "signed": {
      operation = Math.random() < 0.5 ? "addition" : "subtraction";
      left = randomSigned(difficulty >= 4 ? 50 : 20);
      right = randomSigned(difficulty >= 4 ? 50 : 20);
      answer = operation === "addition" ? left + right : left - right;
      text = `${left} ${operation === "addition" ? "+" : "−"} (${right}) = ?`;
      break;
    }
    case "priorities": {
      const a = randomInt(2, difficulty >= 4 ? 30 : 12);
      const b = randomInt(2, 12);
      const c = randomInt(1, 20);
      left = a;
      right = b;
      answer = a + b * c;
      text = `${a} + ${b} × ${c} = ?`;
      operation = "multiplication";
      break;
    }
  }

  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    category,
    operation,
    format,
    left,
    right,
    answer,
    text,
  };
}

export function generateMentalMathQuestions(config: MentalMathConfig): MentalMathQuestion[] {
  const category = config.category || "mixed";
  const difficulty = Math.min(5, Math.max(1, config.difficulty ?? 2));
  const count = Math.min(100, Math.max(1, config.count ?? 10));
  return Array.from({ length: count }, (_, index) => makeQuestion(category, difficulty, index));
}
