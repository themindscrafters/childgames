import type { Difficulty } from '../../../../data/models';

export interface FractionQuestion {
  numerator: number;
  denominator: number;
  visual: 'circle' | 'bar';
  options: string[];
  correct: string;
  hint?: string;
}

// ============================================================
// EASY: 1/2, 1/3, 1/4, 2/4, 3/4 com visuais de círculo, 2 opções
// ============================================================
const EASY_QUESTIONS: FractionQuestion[] = [
  {
    numerator: 1,
    denominator: 2,
    visual: 'circle',
    options: ['1/2', '1/4'],
    correct: '1/2',
    hint: 'Metade do círculo está pintada',
  },
  {
    numerator: 1,
    denominator: 4,
    visual: 'circle',
    options: ['1/4', '1/2'],
    correct: '1/4',
    hint: 'Uma das quatro partes está pintada',
  },
  {
    numerator: 2,
    denominator: 4,
    visual: 'circle',
    options: ['2/4', '3/4'],
    correct: '2/4',
    hint: 'Duas das quatro partes estão pintadas',
  },
  {
    numerator: 3,
    denominator: 4,
    visual: 'circle',
    options: ['3/4', '1/4'],
    correct: '3/4',
    hint: 'Três das quatro partes estão pintadas',
  },
  {
    numerator: 1,
    denominator: 3,
    visual: 'circle',
    options: ['1/3', '2/3'],
    correct: '1/3',
    hint: 'Uma das três partes está pintada',
  },
  {
    numerator: 2,
    denominator: 3,
    visual: 'circle',
    options: ['2/3', '1/3'],
    correct: '2/3',
    hint: 'Duas das três partes estão pintadas',
  },
  {
    numerator: 1,
    denominator: 2,
    visual: 'circle',
    options: ['1/2', '1/3'],
    correct: '1/2',
  },
  {
    numerator: 3,
    denominator: 4,
    visual: 'circle',
    options: ['3/4', '2/4'],
    correct: '3/4',
  },
  {
    numerator: 1,
    denominator: 3,
    visual: 'circle',
    options: ['1/3', '1/4'],
    correct: '1/3',
  },
  {
    numerator: 2,
    denominator: 4,
    visual: 'circle',
    options: ['2/4', '1/4'],
    correct: '2/4',
  },
  {
    numerator: 1,
    denominator: 4,
    visual: 'circle',
    options: ['1/4', '3/4'],
    correct: '1/4',
  },
  {
    numerator: 2,
    denominator: 3,
    visual: 'circle',
    options: ['2/3', '2/4'],
    correct: '2/3',
  },
  {
    numerator: 1,
    denominator: 2,
    visual: 'circle',
    options: ['1/2', '2/3'],
    correct: '1/2',
  },
  {
    numerator: 3,
    denominator: 4,
    visual: 'circle',
    options: ['3/4', '1/3'],
    correct: '3/4',
  },
  {
    numerator: 1,
    denominator: 4,
    visual: 'circle',
    options: ['1/4', '2/3'],
    correct: '1/4',
  },
];

// ============================================================
// MEDIUM: Até 1/8, círculo e barra, 3 opções, frações equivalentes
// ============================================================
const MEDIUM_QUESTIONS: FractionQuestion[] = [
  {
    numerator: 1,
    denominator: 5,
    visual: 'bar',
    options: ['1/5', '2/5', '1/4'],
    correct: '1/5',
  },
  {
    numerator: 3,
    denominator: 5,
    visual: 'circle',
    options: ['3/5', '2/5', '3/4'],
    correct: '3/5',
  },
  {
    numerator: 2,
    denominator: 6,
    visual: 'bar',
    options: ['2/6', '3/6', '1/6'],
    correct: '2/6',
  },
  {
    numerator: 4,
    denominator: 6,
    visual: 'circle',
    options: ['4/6', '3/6', '5/6'],
    correct: '4/6',
  },
  {
    numerator: 3,
    denominator: 8,
    visual: 'bar',
    options: ['3/8', '4/8', '2/8'],
    correct: '3/8',
  },
  {
    numerator: 5,
    denominator: 8,
    visual: 'circle',
    options: ['5/8', '3/8', '6/8'],
    correct: '5/8',
  },
  {
    numerator: 2,
    denominator: 5,
    visual: 'bar',
    options: ['2/5', '3/5', '1/5'],
    correct: '2/5',
  },
  {
    numerator: 4,
    denominator: 8,
    visual: 'circle',
    options: ['4/8', '3/8', '5/8'],
    correct: '4/8',
    hint: '4/8 é o mesmo que 1/2!',
  },
  {
    numerator: 3,
    denominator: 6,
    visual: 'bar',
    options: ['3/6', '2/6', '4/6'],
    correct: '3/6',
    hint: '3/6 é o mesmo que 1/2!',
  },
  {
    numerator: 1,
    denominator: 8,
    visual: 'circle',
    options: ['1/8', '2/8', '1/4'],
    correct: '1/8',
  },
  {
    numerator: 6,
    denominator: 8,
    visual: 'bar',
    options: ['6/8', '5/8', '7/8'],
    correct: '6/8',
    hint: '6/8 é o mesmo que 3/4!',
  },
  {
    numerator: 4,
    denominator: 5,
    visual: 'circle',
    options: ['4/5', '3/5', '5/6'],
    correct: '4/5',
  },
  {
    numerator: 2,
    denominator: 8,
    visual: 'bar',
    options: ['2/8', '3/8', '1/8'],
    correct: '2/8',
    hint: '2/8 é o mesmo que 1/4!',
  },
  {
    numerator: 5,
    denominator: 6,
    visual: 'circle',
    options: ['5/6', '4/6', '3/6'],
    correct: '5/6',
  },
  {
    numerator: 7,
    denominator: 8,
    visual: 'bar',
    options: ['7/8', '6/8', '5/8'],
    correct: '7/8',
  },
];

// ============================================================
// HARD: Comparar frações ("Qual é maior?"), 4 opções, visuais mistos
// ============================================================
const HARD_QUESTIONS: FractionQuestion[] = [
  {
    numerator: 3,
    denominator: 4,
    visual: 'circle',
    options: ['3/4', '2/3', '5/8', '1/2'],
    correct: '3/4',
  },
  {
    numerator: 2,
    denominator: 5,
    visual: 'bar',
    options: ['2/5', '1/3', '3/8', '1/4'],
    correct: '2/5',
  },
  {
    numerator: 5,
    denominator: 6,
    visual: 'circle',
    options: ['5/6', '3/4', '7/8', '2/3'],
    correct: '5/6',
  },
  {
    numerator: 3,
    denominator: 8,
    visual: 'bar',
    options: ['3/8', '1/4', '2/5', '1/3'],
    correct: '3/8',
  },
  {
    numerator: 4,
    denominator: 5,
    visual: 'circle',
    options: ['4/5', '3/4', '5/6', '7/8'],
    correct: '4/5',
  },
  {
    numerator: 1,
    denominator: 6,
    visual: 'bar',
    options: ['1/6', '1/5', '1/8', '1/4'],
    correct: '1/6',
  },
  {
    numerator: 5,
    denominator: 8,
    visual: 'circle',
    options: ['5/8', '3/5', '2/3', '4/6'],
    correct: '5/8',
  },
  {
    numerator: 2,
    denominator: 3,
    visual: 'bar',
    options: ['2/3', '3/5', '4/6', '5/8'],
    correct: '2/3',
  },
  {
    numerator: 7,
    denominator: 8,
    visual: 'circle',
    options: ['7/8', '5/6', '3/4', '4/5'],
    correct: '7/8',
  },
  {
    numerator: 3,
    denominator: 5,
    visual: 'bar',
    options: ['3/5', '2/4', '4/6', '5/8'],
    correct: '3/5',
  },
  {
    numerator: 1,
    denominator: 3,
    visual: 'circle',
    options: ['1/3', '1/4', '2/6', '1/5'],
    correct: '1/3',
  },
  {
    numerator: 4,
    denominator: 6,
    visual: 'bar',
    options: ['4/6', '3/5', '5/8', '2/3'],
    correct: '4/6',
  },
  {
    numerator: 6,
    denominator: 8,
    visual: 'circle',
    options: ['6/8', '5/6', '4/5', '3/4'],
    correct: '6/8',
    hint: '6/8 é o mesmo que 3/4!',
  },
  {
    numerator: 2,
    denominator: 8,
    visual: 'bar',
    options: ['2/8', '1/3', '2/6', '1/5'],
    correct: '2/8',
    hint: '2/8 é o mesmo que 1/4!',
  },
  {
    numerator: 3,
    denominator: 6,
    visual: 'circle',
    options: ['3/6', '2/5', '3/8', '4/8'],
    correct: '3/6',
    hint: '3/6 é o mesmo que 1/2!',
  },
];

export function getFractionQuestions(difficulty: Difficulty): FractionQuestion[] {
  switch (difficulty) {
    case 'easy':
      return EASY_QUESTIONS;
    case 'medium':
      return MEDIUM_QUESTIONS;
    case 'hard':
      return HARD_QUESTIONS;
  }
}
