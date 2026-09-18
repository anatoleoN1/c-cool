export type MentalMathOperation = "addition" | "subtraction" | "multiplication" | "division";
export type MentalMathFormat = "direct" | "missing-left" | "missing-right" | "division";

export type MentalMathQuestion = {
  id: string;
  operation: MentalMathOperation;
  format: MentalMathFormat;
  left: number;
  right: number;
  answer: number;
  text: string;
};

export type MentalMathConfig = {
  operations: MentalMathOperation[];
  formats?: MentalMathFormat[];
  min?: number;
  max?: number;
  count?: number;
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeQuestion(
  operation: MentalMathOperation,
  format: MentalMathFormat,
  min: number,
  max: number,
  index: number,
): MentalMathQuestion {
  let left = randomInt(min, max);
  let right = randomInt(min, max);

  if (operation === "subtraction" && right > left) {
    [left, right] = [right, left];
  }

  if (operation === "division") {
    right = Math.max(1, randomInt(Math.max(1, min), Math.max(1, max)));
    left = right * Math.max(1, randomInt(Math.max(1, min), Math.max(1, max)));
  }

  let answer: number;
  let text: string;

  switch (format) {
    case "missing-left": {
      const symbol = operation === "multiplication" ? "×" : operation === "addition" ? "+" : "−";
      const result = operation === "multiplication" ? left * right : operation === "addition" ? left + right : left - right;
      answer = left;
      text = `? ${symbol} ${right} = ${result}`;
      break;
    }
    case "missing-right": {
      const symbol = operation === "multiplication" ? "×" : operation === "addition" ? "+" : "−";
      const result = operation === "multiplication" ? left * right : operation === "addition" ? left + right : left - right;
      answer = right;
      text = `${left} ${symbol} ? = ${result}`;
      break;
    }
    case "division":
      answer = left / right;
      text = `${left} ÷ ${right} = ?`;
      break;
    default:
      switch (operation) {
        case "addition":
          answer = left + right;
          text = `${left} + ${right} = ?`;
          break;
        case "subtraction":
          answer = left - right;
          text = `${left} − ${right} = ?`;
          break;
        case "multiplication":
          answer = left * right;
          text = `${left} × ${right} = ?`;
          break;
        case "division":
          answer = left / right;
          text = `${left} ÷ ${right} = ?`;
          break;
      }
  }

  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    operation,
    format,
    left,
    right,
    answer,
    text,
  };
}

export function generateMentalMathQuestions(config: MentalMathConfig): MentalMathQuestion[] {
  const operations: MentalMathOperation[] = config.operations.length ? config.operations : ["addition"];
  const formats: MentalMathFormat[] = config.formats?.length ? config.formats : ["direct"];
  const min = Math.max(0, config.min ?? 1);
  const max = Math.max(min, config.max ?? 10);
  const count = Math.max(1, config.count ?? 10);

  return Array.from({ length: count }, (_, index) => {
    const operation = operations[index % operations.length];
    let format = formats[index % formats.length];

    if (operation === "division") format = "division";
    if (operation !== "multiplication" && format === "division") format = "direct";

    return makeQuestion(operation, format, min, max, index);
  });
}
