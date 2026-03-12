import type { Difficulty } from '../../../../data/models';

export type DecimalQuestionType = 'compare' | 'identify' | 'operation';

export interface DecimalQuestion {
  type: DecimalQuestionType;
  question: string;
  display?: { a: number; b: number };
  options: string[];
  correct: string;
  hint?: string;
}

// ============================================================
// EASY: Décimos (0,1 a 0,9), comparações e identificação
// ============================================================
const EASY_QUESTIONS: DecimalQuestion[] = [
  {
    type: 'compare',
    question: 'Qual é maior?',
    display: { a: 0.3, b: 0.7 },
    options: ['0,3', '0,7'],
    correct: '0,7',
  },
  {
    type: 'compare',
    question: 'Qual é maior?',
    display: { a: 0.5, b: 0.2 },
    options: ['0,5', '0,2'],
    correct: '0,5',
  },
  {
    type: 'compare',
    question: 'Qual é menor?',
    display: { a: 0.8, b: 0.4 },
    options: ['0,8', '0,4'],
    correct: '0,4',
  },
  {
    type: 'compare',
    question: 'Qual é maior?',
    display: { a: 0.1, b: 0.9 },
    options: ['0,1', '0,9'],
    correct: '0,9',
  },
  {
    type: 'compare',
    question: 'Qual é menor?',
    display: { a: 0.6, b: 0.3 },
    options: ['0,6', '0,3'],
    correct: '0,3',
  },
  {
    type: 'identify',
    question: 'Qual número está entre 0,4 e 0,6?',
    options: ['0,5', '0,3'],
    correct: '0,5',
    hint: 'Pense no número que fica no meio!',
  },
  {
    type: 'identify',
    question: 'Qual número é a metade de 1?',
    options: ['0,5', '0,3'],
    correct: '0,5',
  },
  {
    type: 'compare',
    question: 'Qual é maior?',
    display: { a: 0.4, b: 0.6 },
    options: ['0,4', '0,6'],
    correct: '0,6',
  },
  {
    type: 'identify',
    question: 'Qual número vem depois de 0,7?',
    options: ['0,8', '0,6'],
    correct: '0,8',
  },
  {
    type: 'compare',
    question: 'Qual é menor?',
    display: { a: 0.9, b: 0.1 },
    options: ['0,9', '0,1'],
    correct: '0,1',
  },
  {
    type: 'identify',
    question: 'Qual número vem antes de 0,5?',
    options: ['0,4', '0,6'],
    correct: '0,4',
  },
  {
    type: 'compare',
    question: 'Qual é maior?',
    display: { a: 0.2, b: 0.8 },
    options: ['0,2', '0,8'],
    correct: '0,8',
  },
  {
    type: 'identify',
    question: 'Qual número é igual a 1/2?',
    options: ['0,5', '0,2'],
    correct: '0,5',
    hint: 'Metade é 0,5!',
  },
  {
    type: 'compare',
    question: 'Qual é menor?',
    display: { a: 0.7, b: 0.5 },
    options: ['0,7', '0,5'],
    correct: '0,5',
  },
  {
    type: 'identify',
    question: 'Qual número está mais perto de 1?',
    options: ['0,9', '0,3'],
    correct: '0,9',
  },
  {
    type: 'compare',
    question: 'Qual é maior?',
    display: { a: 0.6, b: 0.4 },
    options: ['0,6', '0,4'],
    correct: '0,6',
  },
];

// ============================================================
// MEDIUM: Centésimos, converter fração para decimal, somas simples
// ============================================================
const MEDIUM_QUESTIONS: DecimalQuestion[] = [
  {
    type: 'identify',
    question: 'Quanto é 1/2 em decimal?',
    options: ['0,5', '0,25', '0,75'],
    correct: '0,5',
  },
  {
    type: 'identify',
    question: 'Quanto é 1/4 em decimal?',
    options: ['0,25', '0,50', '0,75'],
    correct: '0,25',
  },
  {
    type: 'identify',
    question: 'Quanto é 3/4 em decimal?',
    options: ['0,75', '0,25', '0,50'],
    correct: '0,75',
  },
  {
    type: 'operation',
    question: '0,3 + 0,5 = ?',
    options: ['0,8', '0,35', '0,7'],
    correct: '0,8',
  },
  {
    type: 'operation',
    question: '0,2 + 0,4 = ?',
    options: ['0,6', '0,24', '0,8'],
    correct: '0,6',
  },
  {
    type: 'compare',
    question: 'Qual é maior?',
    display: { a: 0.25, b: 0.52 },
    options: ['0,25', '0,52', 'São iguais'],
    correct: '0,52',
  },
  {
    type: 'identify',
    question: 'Quanto é 1/10 em decimal?',
    options: ['0,1', '0,01', '1,0'],
    correct: '0,1',
  },
  {
    type: 'operation',
    question: '0,7 + 0,3 = ?',
    options: ['1,0', '0,73', '0,10'],
    correct: '1,0',
  },
  {
    type: 'compare',
    question: 'Qual é menor?',
    display: { a: 0.15, b: 0.51 },
    options: ['0,15', '0,51', 'São iguais'],
    correct: '0,15',
  },
  {
    type: 'operation',
    question: '0,4 + 0,4 = ?',
    options: ['0,8', '0,44', '0,48'],
    correct: '0,8',
  },
  {
    type: 'identify',
    question: 'Quanto é 1/5 em decimal?',
    options: ['0,2', '0,5', '0,15'],
    correct: '0,2',
    hint: '1 dividido por 5 é 0,2!',
  },
  {
    type: 'compare',
    question: 'Qual é maior?',
    display: { a: 0.75, b: 0.57 },
    options: ['0,75', '0,57', 'São iguais'],
    correct: '0,75',
  },
  {
    type: 'operation',
    question: '0,1 + 0,9 = ?',
    options: ['1,0', '0,19', '0,10'],
    correct: '1,0',
  },
  {
    type: 'identify',
    question: 'Quanto é 2/5 em decimal?',
    options: ['0,4', '0,25', '0,2'],
    correct: '0,4',
  },
  {
    type: 'operation',
    question: '0,6 + 0,2 = ?',
    options: ['0,8', '0,62', '0,42'],
    correct: '0,8',
  },
  {
    type: 'compare',
    question: 'Qual é maior?',
    display: { a: 0.30, b: 0.03 },
    options: ['0,30', '0,03', 'São iguais'],
    correct: '0,30',
    hint: '0,30 tem 3 décimos, 0,03 tem 3 centésimos!',
  },
];

// ============================================================
// HARD: Adição/subtração, contexto de dinheiro, ordenar 3 decimais
// ============================================================
const HARD_QUESTIONS: DecimalQuestion[] = [
  {
    type: 'operation',
    question: 'R$ 2,50 + R$ 1,75 = ?',
    options: ['R$ 4,25', 'R$ 3,25', 'R$ 4,75', 'R$ 3,75'],
    correct: 'R$ 4,25',
  },
  {
    type: 'operation',
    question: 'R$ 5,00 - R$ 2,30 = ?',
    options: ['R$ 2,70', 'R$ 3,70', 'R$ 2,30', 'R$ 3,30'],
    correct: 'R$ 2,70',
  },
  {
    type: 'operation',
    question: '1,5 + 2,75 = ?',
    options: ['4,25', '3,25', '4,75', '3,75'],
    correct: '4,25',
  },
  {
    type: 'compare',
    question: 'Qual é a ordem crescente?',
    options: [
      '0,3 < 0,5 < 0,8',
      '0,5 < 0,3 < 0,8',
      '0,8 < 0,5 < 0,3',
      '0,3 < 0,8 < 0,5',
    ],
    correct: '0,3 < 0,5 < 0,8',
  },
  {
    type: 'operation',
    question: 'R$ 10,00 - R$ 3,45 = ?',
    options: ['R$ 6,55', 'R$ 7,55', 'R$ 6,45', 'R$ 7,45'],
    correct: 'R$ 6,55',
  },
  {
    type: 'compare',
    question: 'Qual é a ordem decrescente?',
    options: [
      '0,9 > 0,6 > 0,2',
      '0,6 > 0,9 > 0,2',
      '0,2 > 0,6 > 0,9',
      '0,9 > 0,2 > 0,6',
    ],
    correct: '0,9 > 0,6 > 0,2',
  },
  {
    type: 'operation',
    question: '3,25 + 1,50 = ?',
    options: ['4,75', '4,25', '5,75', '3,75'],
    correct: '4,75',
  },
  {
    type: 'operation',
    question: 'R$ 7,80 - R$ 4,30 = ?',
    options: ['R$ 3,50', 'R$ 4,50', 'R$ 3,80', 'R$ 2,50'],
    correct: 'R$ 3,50',
  },
  {
    type: 'compare',
    question: 'Qual é a ordem crescente?',
    options: [
      '0,15 < 0,51 < 0,85',
      '0,51 < 0,15 < 0,85',
      '0,85 < 0,51 < 0,15',
      '0,15 < 0,85 < 0,51',
    ],
    correct: '0,15 < 0,51 < 0,85',
  },
  {
    type: 'operation',
    question: '2,60 + 3,40 = ?',
    options: ['6,00', '5,00', '6,40', '5,60'],
    correct: '6,00',
  },
  {
    type: 'operation',
    question: 'R$ 8,50 - R$ 5,25 = ?',
    options: ['R$ 3,25', 'R$ 4,25', 'R$ 3,75', 'R$ 2,25'],
    correct: 'R$ 3,25',
  },
  {
    type: 'compare',
    question: 'Qual é a ordem decrescente?',
    options: [
      '0,75 > 0,50 > 0,25',
      '0,50 > 0,75 > 0,25',
      '0,25 > 0,50 > 0,75',
      '0,75 > 0,25 > 0,50',
    ],
    correct: '0,75 > 0,50 > 0,25',
  },
  {
    type: 'operation',
    question: '4,80 - 2,30 = ?',
    options: ['2,50', '2,80', '3,50', '1,50'],
    correct: '2,50',
  },
  {
    type: 'operation',
    question: 'R$ 1,99 + R$ 3,01 = ?',
    options: ['R$ 5,00', 'R$ 4,00', 'R$ 5,01', 'R$ 4,99'],
    correct: 'R$ 5,00',
  },
  {
    type: 'compare',
    question: 'Qual é a ordem crescente?',
    options: [
      '0,08 < 0,38 < 0,83',
      '0,38 < 0,08 < 0,83',
      '0,83 < 0,38 < 0,08',
      '0,08 < 0,83 < 0,38',
    ],
    correct: '0,08 < 0,38 < 0,83',
  },
  {
    type: 'operation',
    question: 'R$ 6,25 + R$ 2,75 = ?',
    options: ['R$ 9,00', 'R$ 8,00', 'R$ 9,25', 'R$ 8,75'],
    correct: 'R$ 9,00',
  },
];

export function getDecimalQuestions(difficulty: Difficulty): DecimalQuestion[] {
  switch (difficulty) {
    case 'easy':
      return EASY_QUESTIONS;
    case 'medium':
      return MEDIUM_QUESTIONS;
    case 'hard':
      return HARD_QUESTIONS;
  }
}
