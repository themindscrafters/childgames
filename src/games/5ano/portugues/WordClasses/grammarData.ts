export type WordClass = 'substantivo' | 'verbo' | 'adjetivo' | 'advérbio' | 'pronome';

export interface GrammarQuestion {
  sentence: string;
  words: { text: string; class: WordClass }[];
  targetClass: WordClass;
  correctWordIndex: number;
}

export const WORD_CLASS_LABELS: Record<WordClass, string> = {
  substantivo: 'Substantivo',
  verbo: 'Verbo',
  adjetivo: 'Adjetivo',
  advérbio: 'Advérbio',
  pronome: 'Pronome',
};

export const WORD_CLASS_COLORS: Record<WordClass, string> = {
  substantivo: '#3B82F6',
  verbo: '#EF4444',
  adjetivo: '#F59E0B',
  advérbio: '#8B5CF6',
  pronome: '#10B981',
};

// ============================================================
// EASY: Substantivos e verbos em frases simples (4-5 palavras)
// ============================================================
const EASY_QUESTIONS: GrammarQuestion[] = [
  {
    sentence: 'O gato dormiu cedo.',
    words: [
      { text: 'O', class: 'pronome' },
      { text: 'gato', class: 'substantivo' },
      { text: 'dormiu', class: 'verbo' },
      { text: 'cedo', class: 'advérbio' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 1,
  },
  {
    sentence: 'A menina corre rápido.',
    words: [
      { text: 'A', class: 'pronome' },
      { text: 'menina', class: 'substantivo' },
      { text: 'corre', class: 'verbo' },
      { text: 'rápido', class: 'advérbio' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 2,
  },
  {
    sentence: 'O cachorro ladrou forte.',
    words: [
      { text: 'O', class: 'pronome' },
      { text: 'cachorro', class: 'substantivo' },
      { text: 'ladrou', class: 'verbo' },
      { text: 'forte', class: 'advérbio' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 1,
  },
  {
    sentence: 'Maria estuda muito.',
    words: [
      { text: 'Maria', class: 'substantivo' },
      { text: 'estuda', class: 'verbo' },
      { text: 'muito', class: 'advérbio' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 1,
  },
  {
    sentence: 'O sol brilha hoje.',
    words: [
      { text: 'O', class: 'pronome' },
      { text: 'sol', class: 'substantivo' },
      { text: 'brilha', class: 'verbo' },
      { text: 'hoje', class: 'advérbio' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 1,
  },
  {
    sentence: 'Pedro comeu bolo.',
    words: [
      { text: 'Pedro', class: 'substantivo' },
      { text: 'comeu', class: 'verbo' },
      { text: 'bolo', class: 'substantivo' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 1,
  },
  {
    sentence: 'A flor cresceu ali.',
    words: [
      { text: 'A', class: 'pronome' },
      { text: 'flor', class: 'substantivo' },
      { text: 'cresceu', class: 'verbo' },
      { text: 'ali', class: 'advérbio' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 1,
  },
  {
    sentence: 'O pássaro voou longe.',
    words: [
      { text: 'O', class: 'pronome' },
      { text: 'pássaro', class: 'substantivo' },
      { text: 'voou', class: 'verbo' },
      { text: 'longe', class: 'advérbio' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 2,
  },
  {
    sentence: 'Lucas brinca aqui.',
    words: [
      { text: 'Lucas', class: 'substantivo' },
      { text: 'brinca', class: 'verbo' },
      { text: 'aqui', class: 'advérbio' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 0,
  },
  {
    sentence: 'A lua surgiu cedo.',
    words: [
      { text: 'A', class: 'pronome' },
      { text: 'lua', class: 'substantivo' },
      { text: 'surgiu', class: 'verbo' },
      { text: 'cedo', class: 'advérbio' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 2,
  },
  {
    sentence: 'O rio corre sempre.',
    words: [
      { text: 'O', class: 'pronome' },
      { text: 'rio', class: 'substantivo' },
      { text: 'corre', class: 'verbo' },
      { text: 'sempre', class: 'advérbio' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 1,
  },
  {
    sentence: 'Ana leu ontem.',
    words: [
      { text: 'Ana', class: 'substantivo' },
      { text: 'leu', class: 'verbo' },
      { text: 'ontem', class: 'advérbio' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 1,
  },
  {
    sentence: 'O vento soprou forte.',
    words: [
      { text: 'O', class: 'pronome' },
      { text: 'vento', class: 'substantivo' },
      { text: 'soprou', class: 'verbo' },
      { text: 'forte', class: 'advérbio' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 1,
  },
  {
    sentence: 'Carlos cantou bem.',
    words: [
      { text: 'Carlos', class: 'substantivo' },
      { text: 'cantou', class: 'verbo' },
      { text: 'bem', class: 'advérbio' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 1,
  },
  {
    sentence: 'A chuva caiu hoje.',
    words: [
      { text: 'A', class: 'pronome' },
      { text: 'chuva', class: 'substantivo' },
      { text: 'caiu', class: 'verbo' },
      { text: 'hoje', class: 'advérbio' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 1,
  },
  {
    sentence: 'O peixe nadou rápido.',
    words: [
      { text: 'O', class: 'pronome' },
      { text: 'peixe', class: 'substantivo' },
      { text: 'nadou', class: 'verbo' },
      { text: 'rápido', class: 'advérbio' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 2,
  },
];

// ============================================================
// MEDIUM: + adjetivos e pronomes, frases de 6-8 palavras
// ============================================================
const MEDIUM_QUESTIONS: GrammarQuestion[] = [
  {
    sentence: 'O menino esperto resolveu o problema.',
    words: [
      { text: 'O', class: 'pronome' },
      { text: 'menino', class: 'substantivo' },
      { text: 'esperto', class: 'adjetivo' },
      { text: 'resolveu', class: 'verbo' },
      { text: 'o', class: 'pronome' },
      { text: 'problema', class: 'substantivo' },
    ],
    targetClass: 'adjetivo',
    correctWordIndex: 2,
  },
  {
    sentence: 'Ela comprou uma bonita blusa vermelha.',
    words: [
      { text: 'Ela', class: 'pronome' },
      { text: 'comprou', class: 'verbo' },
      { text: 'uma', class: 'pronome' },
      { text: 'bonita', class: 'adjetivo' },
      { text: 'blusa', class: 'substantivo' },
      { text: 'vermelha', class: 'adjetivo' },
    ],
    targetClass: 'pronome',
    correctWordIndex: 0,
  },
  {
    sentence: 'Nós brincamos no parque grande.',
    words: [
      { text: 'Nós', class: 'pronome' },
      { text: 'brincamos', class: 'verbo' },
      { text: 'no', class: 'pronome' },
      { text: 'parque', class: 'substantivo' },
      { text: 'grande', class: 'adjetivo' },
    ],
    targetClass: 'adjetivo',
    correctWordIndex: 4,
  },
  {
    sentence: 'A professora gentil explicou a matéria.',
    words: [
      { text: 'A', class: 'pronome' },
      { text: 'professora', class: 'substantivo' },
      { text: 'gentil', class: 'adjetivo' },
      { text: 'explicou', class: 'verbo' },
      { text: 'a', class: 'pronome' },
      { text: 'matéria', class: 'substantivo' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 1,
  },
  {
    sentence: 'Ele encontrou um livro interessante ontem.',
    words: [
      { text: 'Ele', class: 'pronome' },
      { text: 'encontrou', class: 'verbo' },
      { text: 'um', class: 'pronome' },
      { text: 'livro', class: 'substantivo' },
      { text: 'interessante', class: 'adjetivo' },
      { text: 'ontem', class: 'advérbio' },
    ],
    targetClass: 'pronome',
    correctWordIndex: 0,
  },
  {
    sentence: 'O cachorro pequeno correu pelo jardim.',
    words: [
      { text: 'O', class: 'pronome' },
      { text: 'cachorro', class: 'substantivo' },
      { text: 'pequeno', class: 'adjetivo' },
      { text: 'correu', class: 'verbo' },
      { text: 'pelo', class: 'pronome' },
      { text: 'jardim', class: 'substantivo' },
    ],
    targetClass: 'adjetivo',
    correctWordIndex: 2,
  },
  {
    sentence: 'Eles viajaram para a cidade antiga.',
    words: [
      { text: 'Eles', class: 'pronome' },
      { text: 'viajaram', class: 'verbo' },
      { text: 'para', class: 'pronome' },
      { text: 'a', class: 'pronome' },
      { text: 'cidade', class: 'substantivo' },
      { text: 'antiga', class: 'adjetivo' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 1,
  },
  {
    sentence: 'A comida deliciosa agradou todos nós.',
    words: [
      { text: 'A', class: 'pronome' },
      { text: 'comida', class: 'substantivo' },
      { text: 'deliciosa', class: 'adjetivo' },
      { text: 'agradou', class: 'verbo' },
      { text: 'todos', class: 'pronome' },
      { text: 'nós', class: 'pronome' },
    ],
    targetClass: 'adjetivo',
    correctWordIndex: 2,
  },
  {
    sentence: 'Eu desenhei uma casa colorida hoje.',
    words: [
      { text: 'Eu', class: 'pronome' },
      { text: 'desenhei', class: 'verbo' },
      { text: 'uma', class: 'pronome' },
      { text: 'casa', class: 'substantivo' },
      { text: 'colorida', class: 'adjetivo' },
      { text: 'hoje', class: 'advérbio' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 3,
  },
  {
    sentence: 'O aluno dedicado estudou a lição difícil.',
    words: [
      { text: 'O', class: 'pronome' },
      { text: 'aluno', class: 'substantivo' },
      { text: 'dedicado', class: 'adjetivo' },
      { text: 'estudou', class: 'verbo' },
      { text: 'a', class: 'pronome' },
      { text: 'lição', class: 'substantivo' },
      { text: 'difícil', class: 'adjetivo' },
    ],
    targetClass: 'pronome',
    correctWordIndex: 0,
  },
  {
    sentence: 'Ela preparou um bolo enorme e gostoso.',
    words: [
      { text: 'Ela', class: 'pronome' },
      { text: 'preparou', class: 'verbo' },
      { text: 'um', class: 'pronome' },
      { text: 'bolo', class: 'substantivo' },
      { text: 'enorme', class: 'adjetivo' },
      { text: 'e', class: 'pronome' },
      { text: 'gostoso', class: 'adjetivo' },
    ],
    targetClass: 'adjetivo',
    correctWordIndex: 4,
  },
  {
    sentence: 'Tu compraste aquele presente lindo.',
    words: [
      { text: 'Tu', class: 'pronome' },
      { text: 'compraste', class: 'verbo' },
      { text: 'aquele', class: 'pronome' },
      { text: 'presente', class: 'substantivo' },
      { text: 'lindo', class: 'adjetivo' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 1,
  },
  {
    sentence: 'O gato preguiçoso dormiu no sofá macio.',
    words: [
      { text: 'O', class: 'pronome' },
      { text: 'gato', class: 'substantivo' },
      { text: 'preguiçoso', class: 'adjetivo' },
      { text: 'dormiu', class: 'verbo' },
      { text: 'no', class: 'pronome' },
      { text: 'sofá', class: 'substantivo' },
      { text: 'macio', class: 'adjetivo' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 5,
  },
  {
    sentence: 'Nós assistimos um filme divertido juntos.',
    words: [
      { text: 'Nós', class: 'pronome' },
      { text: 'assistimos', class: 'verbo' },
      { text: 'um', class: 'pronome' },
      { text: 'filme', class: 'substantivo' },
      { text: 'divertido', class: 'adjetivo' },
      { text: 'juntos', class: 'advérbio' },
    ],
    targetClass: 'adjetivo',
    correctWordIndex: 4,
  },
  {
    sentence: 'Vocês trouxeram as flores bonitas.',
    words: [
      { text: 'Vocês', class: 'pronome' },
      { text: 'trouxeram', class: 'verbo' },
      { text: 'as', class: 'pronome' },
      { text: 'flores', class: 'substantivo' },
      { text: 'bonitas', class: 'adjetivo' },
    ],
    targetClass: 'pronome',
    correctWordIndex: 0,
  },
  {
    sentence: 'A escola nova tem uma quadra ampla.',
    words: [
      { text: 'A', class: 'pronome' },
      { text: 'escola', class: 'substantivo' },
      { text: 'nova', class: 'adjetivo' },
      { text: 'tem', class: 'verbo' },
      { text: 'uma', class: 'pronome' },
      { text: 'quadra', class: 'substantivo' },
      { text: 'ampla', class: 'adjetivo' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 3,
  },
];

// ============================================================
// HARD: + advérbios, frases mais longas, palavras menos óbvias
// ============================================================
const HARD_QUESTIONS: GrammarQuestion[] = [
  {
    sentence: 'A criança cuidadosamente pintou o quadro colorido.',
    words: [
      { text: 'A', class: 'pronome' },
      { text: 'criança', class: 'substantivo' },
      { text: 'cuidadosamente', class: 'advérbio' },
      { text: 'pintou', class: 'verbo' },
      { text: 'o', class: 'pronome' },
      { text: 'quadro', class: 'substantivo' },
      { text: 'colorido', class: 'adjetivo' },
    ],
    targetClass: 'advérbio',
    correctWordIndex: 2,
  },
  {
    sentence: 'Ele rapidamente correu para a escola distante.',
    words: [
      { text: 'Ele', class: 'pronome' },
      { text: 'rapidamente', class: 'advérbio' },
      { text: 'correu', class: 'verbo' },
      { text: 'para', class: 'pronome' },
      { text: 'a', class: 'pronome' },
      { text: 'escola', class: 'substantivo' },
      { text: 'distante', class: 'adjetivo' },
    ],
    targetClass: 'advérbio',
    correctWordIndex: 1,
  },
  {
    sentence: 'Os alunos inteligentes resolveram facilmente as questões.',
    words: [
      { text: 'Os', class: 'pronome' },
      { text: 'alunos', class: 'substantivo' },
      { text: 'inteligentes', class: 'adjetivo' },
      { text: 'resolveram', class: 'verbo' },
      { text: 'facilmente', class: 'advérbio' },
      { text: 'as', class: 'pronome' },
      { text: 'questões', class: 'substantivo' },
    ],
    targetClass: 'adjetivo',
    correctWordIndex: 2,
  },
  {
    sentence: 'Nós calmamente organizamos os materiais escolares novos.',
    words: [
      { text: 'Nós', class: 'pronome' },
      { text: 'calmamente', class: 'advérbio' },
      { text: 'organizamos', class: 'verbo' },
      { text: 'os', class: 'pronome' },
      { text: 'materiais', class: 'substantivo' },
      { text: 'escolares', class: 'adjetivo' },
      { text: 'novos', class: 'adjetivo' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 4,
  },
  {
    sentence: 'A professora atenciosamente explicou o conteúdo complexo.',
    words: [
      { text: 'A', class: 'pronome' },
      { text: 'professora', class: 'substantivo' },
      { text: 'atenciosamente', class: 'advérbio' },
      { text: 'explicou', class: 'verbo' },
      { text: 'o', class: 'pronome' },
      { text: 'conteúdo', class: 'substantivo' },
      { text: 'complexo', class: 'adjetivo' },
    ],
    targetClass: 'advérbio',
    correctWordIndex: 2,
  },
  {
    sentence: 'Elas gentilmente ajudaram os colegas novos na escola.',
    words: [
      { text: 'Elas', class: 'pronome' },
      { text: 'gentilmente', class: 'advérbio' },
      { text: 'ajudaram', class: 'verbo' },
      { text: 'os', class: 'pronome' },
      { text: 'colegas', class: 'substantivo' },
      { text: 'novos', class: 'adjetivo' },
      { text: 'na', class: 'pronome' },
      { text: 'escola', class: 'substantivo' },
    ],
    targetClass: 'pronome',
    correctWordIndex: 0,
  },
  {
    sentence: 'O cientista dedicado pesquisou intensamente a solução.',
    words: [
      { text: 'O', class: 'pronome' },
      { text: 'cientista', class: 'substantivo' },
      { text: 'dedicado', class: 'adjetivo' },
      { text: 'pesquisou', class: 'verbo' },
      { text: 'intensamente', class: 'advérbio' },
      { text: 'a', class: 'pronome' },
      { text: 'solução', class: 'substantivo' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 3,
  },
  {
    sentence: 'Aquele livro antigo contém histórias maravilhosas e emocionantes.',
    words: [
      { text: 'Aquele', class: 'pronome' },
      { text: 'livro', class: 'substantivo' },
      { text: 'antigo', class: 'adjetivo' },
      { text: 'contém', class: 'verbo' },
      { text: 'histórias', class: 'substantivo' },
      { text: 'maravilhosas', class: 'adjetivo' },
      { text: 'e', class: 'pronome' },
      { text: 'emocionantes', class: 'adjetivo' },
    ],
    targetClass: 'adjetivo',
    correctWordIndex: 5,
  },
  {
    sentence: 'Ela silenciosamente observou as estrelas brilhantes no céu.',
    words: [
      { text: 'Ela', class: 'pronome' },
      { text: 'silenciosamente', class: 'advérbio' },
      { text: 'observou', class: 'verbo' },
      { text: 'as', class: 'pronome' },
      { text: 'estrelas', class: 'substantivo' },
      { text: 'brilhantes', class: 'adjetivo' },
      { text: 'no', class: 'pronome' },
      { text: 'céu', class: 'substantivo' },
    ],
    targetClass: 'advérbio',
    correctWordIndex: 1,
  },
  {
    sentence: 'Os pássaros migratórios voaram velozmente para o sul.',
    words: [
      { text: 'Os', class: 'pronome' },
      { text: 'pássaros', class: 'substantivo' },
      { text: 'migratórios', class: 'adjetivo' },
      { text: 'voaram', class: 'verbo' },
      { text: 'velozmente', class: 'advérbio' },
      { text: 'para', class: 'pronome' },
      { text: 'o', class: 'pronome' },
      { text: 'sul', class: 'substantivo' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 1,
  },
  {
    sentence: 'Eu cuidadosamente li aquele texto longo e difícil.',
    words: [
      { text: 'Eu', class: 'pronome' },
      { text: 'cuidadosamente', class: 'advérbio' },
      { text: 'li', class: 'verbo' },
      { text: 'aquele', class: 'pronome' },
      { text: 'texto', class: 'substantivo' },
      { text: 'longo', class: 'adjetivo' },
      { text: 'e', class: 'pronome' },
      { text: 'difícil', class: 'adjetivo' },
    ],
    targetClass: 'adjetivo',
    correctWordIndex: 5,
  },
  {
    sentence: 'A equipe talentosa trabalhou arduamente no projeto importante.',
    words: [
      { text: 'A', class: 'pronome' },
      { text: 'equipe', class: 'substantivo' },
      { text: 'talentosa', class: 'adjetivo' },
      { text: 'trabalhou', class: 'verbo' },
      { text: 'arduamente', class: 'advérbio' },
      { text: 'no', class: 'pronome' },
      { text: 'projeto', class: 'substantivo' },
      { text: 'importante', class: 'adjetivo' },
    ],
    targetClass: 'advérbio',
    correctWordIndex: 4,
  },
  {
    sentence: 'Eles constantemente praticam os exercícios matemáticos avançados.',
    words: [
      { text: 'Eles', class: 'pronome' },
      { text: 'constantemente', class: 'advérbio' },
      { text: 'praticam', class: 'verbo' },
      { text: 'os', class: 'pronome' },
      { text: 'exercícios', class: 'substantivo' },
      { text: 'matemáticos', class: 'adjetivo' },
      { text: 'avançados', class: 'adjetivo' },
    ],
    targetClass: 'verbo',
    correctWordIndex: 2,
  },
  {
    sentence: 'A natureza exuberante sempre impressiona os visitantes curiosos.',
    words: [
      { text: 'A', class: 'pronome' },
      { text: 'natureza', class: 'substantivo' },
      { text: 'exuberante', class: 'adjetivo' },
      { text: 'sempre', class: 'advérbio' },
      { text: 'impressiona', class: 'verbo' },
      { text: 'os', class: 'pronome' },
      { text: 'visitantes', class: 'substantivo' },
      { text: 'curiosos', class: 'adjetivo' },
    ],
    targetClass: 'substantivo',
    correctWordIndex: 6,
  },
  {
    sentence: 'Nós pacientemente esperamos o resultado final do concurso.',
    words: [
      { text: 'Nós', class: 'pronome' },
      { text: 'pacientemente', class: 'advérbio' },
      { text: 'esperamos', class: 'verbo' },
      { text: 'o', class: 'pronome' },
      { text: 'resultado', class: 'substantivo' },
      { text: 'final', class: 'adjetivo' },
      { text: 'do', class: 'pronome' },
      { text: 'concurso', class: 'substantivo' },
    ],
    targetClass: 'advérbio',
    correctWordIndex: 1,
  },
  {
    sentence: 'Aquela aluna responsável completou perfeitamente a tarefa.',
    words: [
      { text: 'Aquela', class: 'pronome' },
      { text: 'aluna', class: 'substantivo' },
      { text: 'responsável', class: 'adjetivo' },
      { text: 'completou', class: 'verbo' },
      { text: 'perfeitamente', class: 'advérbio' },
      { text: 'a', class: 'pronome' },
      { text: 'tarefa', class: 'substantivo' },
    ],
    targetClass: 'pronome',
    correctWordIndex: 0,
  },
];

import type { Difficulty } from '../../../../data/models';

export function getGrammarQuestions(difficulty: Difficulty): GrammarQuestion[] {
  switch (difficulty) {
    case 'easy':
      return EASY_QUESTIONS;
    case 'medium':
      return MEDIUM_QUESTIONS;
    case 'hard':
      return HARD_QUESTIONS;
  }
}
