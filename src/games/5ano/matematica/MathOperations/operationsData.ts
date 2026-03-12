export interface MathProblem {
  question: string;
  answer: number;
  options: number[];
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDistractors(correct: number, count: number): number[] {
  const options = new Set<number>([correct]);
  const strategies = [
    () => correct + randInt(1, 5),
    () => correct - randInt(1, 5),
    () => correct + 10,
    () => correct - 10,
    () => correct * 2,
    () => Math.floor(correct / 2),
    () => correct + randInt(1, 3) * (Math.random() < 0.5 ? 1 : -1),
  ];

  let attempts = 0;
  while (options.size < count && attempts < 50) {
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const candidate = strategy();
    if (candidate > 0 && candidate !== correct && !options.has(candidate)) {
      options.add(candidate);
    }
    attempts++;
  }

  // Fallback: fill remaining with sequential offsets
  let offset = 1;
  while (options.size < count) {
    const candidate = correct + offset;
    if (candidate > 0 && !options.has(candidate)) {
      options.add(candidate);
    }
    offset = offset > 0 ? -offset : -offset + 1;
  }

  return shuffle([...options]);
}

function generateEasyProblem(): MathProblem {
  const isMultiplication = Math.random() < 0.6;

  if (isMultiplication) {
    const a = randInt(2, 5);
    const b = randInt(2, 9);
    const answer = a * b;
    return {
      question: `${a} \u00D7 ${b} = ?`,
      answer,
      options: generateDistractors(answer, 4),
    };
  } else {
    const divisor = randInt(2, 5);
    const quotient = randInt(2, 9);
    const dividend = divisor * quotient;
    return {
      question: `${dividend} \u00F7 ${divisor} = ?`,
      answer: quotient,
      options: generateDistractors(quotient, 4),
    };
  }
}

function generateMediumProblem(): MathProblem {
  const type = Math.random();

  if (type < 0.4) {
    // Tables 6-9
    const a = randInt(6, 9);
    const b = randInt(3, 9);
    const answer = a * b;
    return {
      question: `${a} \u00D7 ${b} = ?`,
      answer,
      options: generateDistractors(answer, 4),
    };
  } else if (type < 0.7) {
    // Division with exact results up to 100
    const divisor = randInt(3, 9);
    const quotient = randInt(3, 12);
    const dividend = divisor * quotient;
    return {
      question: `${dividend} \u00F7 ${divisor} = ?`,
      answer: quotient,
      options: generateDistractors(quotient, 4),
    };
  } else {
    // Mixed: two operations
    const a = randInt(3, 8);
    const b = randInt(2, 6);
    const answer = a * b;
    // Present as multiplication
    return {
      question: `${a} \u00D7 ${b} = ?`,
      answer,
      options: generateDistractors(answer, 4),
    };
  }
}

function generateHardProblem(): MathProblem {
  const type = Math.random();

  if (type < 0.35) {
    // 2-digit x 1-digit
    const a = randInt(11, 25);
    const b = randInt(2, 6);
    const answer = a * b;
    return {
      question: `${a} \u00D7 ${b} = ?`,
      answer,
      options: generateDistractors(answer, 4),
    };
  } else if (type < 0.65) {
    // Missing operand: ___ x b = result
    const a = randInt(3, 9);
    const b = randInt(3, 9);
    const result = a * b;
    return {
      question: `___ \u00D7 ${b} = ${result}`,
      answer: a,
      options: generateDistractors(a, 4),
    };
  } else if (type < 0.85) {
    // Larger divisions
    const divisor = randInt(4, 12);
    const quotient = randInt(5, 15);
    const dividend = divisor * quotient;
    return {
      question: `${dividend} \u00F7 ${divisor} = ?`,
      answer: quotient,
      options: generateDistractors(quotient, 4),
    };
  } else {
    // Missing operand in division: result / ___ = quotient
    const divisor = randInt(3, 8);
    const quotient = randInt(3, 9);
    const dividend = divisor * quotient;
    return {
      question: `${dividend} \u00F7 ___ = ${quotient}`,
      answer: divisor,
      options: generateDistractors(divisor, 4),
    };
  }
}

export function generateProblem(difficulty: 'easy' | 'medium' | 'hard'): MathProblem {
  switch (difficulty) {
    case 'easy':
      return generateEasyProblem();
    case 'medium':
      return generateMediumProblem();
    case 'hard':
      return generateHardProblem();
  }
}
