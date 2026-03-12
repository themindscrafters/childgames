import type { Difficulty } from '../../../../data/models';

export interface Planet {
  name: string;
  emoji: string;
  orderFromSun: number;
  type: 'rochoso' | 'gasoso';
  characteristics: string[];
  funFact: string;
  color: string;
}

export interface SolarQuestion {
  question: string;
  options: string[];
  correct: string;
  planetRelated?: string;
  hint?: string;
}

export const PLANETS: Planet[] = [
  {
    name: 'Mercúrio',
    emoji: '☿️',
    orderFromSun: 1,
    type: 'rochoso',
    characteristics: ['Menor planeta do Sistema Solar', 'Mais próximo do Sol', 'Não possui lua'],
    funFact: 'Um dia em Mercúrio dura 59 dias terrestres!',
    color: '#9CA3AF',
  },
  {
    name: 'Vênus',
    emoji: '♀️',
    orderFromSun: 2,
    type: 'rochoso',
    characteristics: ['Planeta mais quente', 'Gira ao contrário', 'Conhecido como Estrela Dalva'],
    funFact: 'Vênus é o planeta mais quente, mesmo não sendo o mais próximo do Sol!',
    color: '#F59E0B',
  },
  {
    name: 'Terra',
    emoji: '🌍',
    orderFromSun: 3,
    type: 'rochoso',
    characteristics: ['Único com água líquida', 'Possui vida', 'Tem uma lua'],
    funFact: 'A Terra é o único planeta que não tem nome de um deus!',
    color: '#3B82F6',
  },
  {
    name: 'Marte',
    emoji: '🔴',
    orderFromSun: 4,
    type: 'rochoso',
    characteristics: ['Planeta Vermelho', 'Tem o maior vulcão do Sistema Solar', 'Possui duas luas'],
    funFact: 'O Monte Olimpo em Marte é três vezes mais alto que o Everest!',
    color: '#EF4444',
  },
  {
    name: 'Júpiter',
    emoji: '🟤',
    orderFromSun: 5,
    type: 'gasoso',
    characteristics: ['Maior planeta', 'Grande Mancha Vermelha', 'Possui mais de 90 luas'],
    funFact: 'Júpiter é tão grande que todos os outros planetas caberiam dentro dele!',
    color: '#D97706',
  },
  {
    name: 'Saturno',
    emoji: '🪐',
    orderFromSun: 6,
    type: 'gasoso',
    characteristics: ['Famoso pelos anéis', 'Menos denso que a água', 'Possui mais de 140 luas'],
    funFact: 'Se existisse um oceano grande o bastante, Saturno flutuaria nele!',
    color: '#FBBF24',
  },
  {
    name: 'Urano',
    emoji: '🔵',
    orderFromSun: 7,
    type: 'gasoso',
    characteristics: ['Gira de lado', 'Planeta gelado', 'Cor azul-esverdeada'],
    funFact: 'Urano gira praticamente deitado, como uma bola rolando!',
    color: '#06B6D4',
  },
  {
    name: 'Netuno',
    emoji: '🫧',
    orderFromSun: 8,
    type: 'gasoso',
    characteristics: ['Ventos mais fortes do Sistema Solar', 'Planeta mais distante', 'Cor azul intensa'],
    funFact: 'Os ventos de Netuno podem chegar a 2.100 km/h!',
    color: '#2563EB',
  },
];

const EASY_QUESTIONS: SolarQuestion[] = [
  { question: 'Qual é o menor planeta do Sistema Solar?', options: ['Mercúrio', 'Marte', 'Terra', 'Vênus'], correct: 'Mercúrio', planetRelated: 'Mercúrio', hint: 'É o mais próximo do Sol' },
  { question: 'Qual planeta é conhecido como Planeta Vermelho?', options: ['Marte', 'Júpiter', 'Vênus', 'Saturno'], correct: 'Marte', planetRelated: 'Marte', hint: 'Sua cor lembra ferrugem' },
  { question: 'Qual é o maior planeta do Sistema Solar?', options: ['Júpiter', 'Saturno', 'Netuno', 'Urano'], correct: 'Júpiter', planetRelated: 'Júpiter', hint: 'É um gigante gasoso' },
  { question: 'Qual planeta tem anéis famosos?', options: ['Saturno', 'Júpiter', 'Urano', 'Netuno'], correct: 'Saturno', planetRelated: 'Saturno', hint: 'Seus anéis são feitos de gelo e rocha' },
  { question: 'Em qual planeta vivemos?', options: ['Terra', 'Marte', 'Vênus', 'Mercúrio'], correct: 'Terra', planetRelated: 'Terra', hint: 'É o terceiro planeta' },
  { question: 'Qual planeta é o mais próximo do Sol?', options: ['Mercúrio', 'Vênus', 'Terra', 'Marte'], correct: 'Mercúrio', planetRelated: 'Mercúrio', hint: 'É também o menor' },
  { question: 'Qual planeta é o mais distante do Sol?', options: ['Netuno', 'Urano', 'Saturno', 'Júpiter'], correct: 'Netuno', planetRelated: 'Netuno', hint: 'Tem cor azul intensa' },
  { question: 'Qual planeta é conhecido como Estrela Dalva?', options: ['Vênus', 'Mercúrio', 'Marte', 'Terra'], correct: 'Vênus', planetRelated: 'Vênus', hint: 'É o segundo planeta do Sol' },
  { question: 'Qual é o 1º planeta a partir do Sol?', options: ['Mercúrio', 'Vênus', 'Terra', 'Marte'], correct: 'Mercúrio', planetRelated: 'Mercúrio' },
  { question: 'Qual é o 3º planeta a partir do Sol?', options: ['Terra', 'Marte', 'Vênus', 'Júpiter'], correct: 'Terra', planetRelated: 'Terra' },
  { question: 'Qual é o 5º planeta a partir do Sol?', options: ['Júpiter', 'Saturno', 'Marte', 'Urano'], correct: 'Júpiter', planetRelated: 'Júpiter' },
  { question: 'Qual planeta tem a cor azul?', options: ['Netuno', 'Marte', 'Vênus', 'Saturno'], correct: 'Netuno', planetRelated: 'Netuno' },
  { question: 'Qual planeta é o mais quente?', options: ['Vênus', 'Mercúrio', 'Marte', 'Júpiter'], correct: 'Vênus', planetRelated: 'Vênus', hint: 'Não é o mais próximo do Sol!' },
  { question: 'Qual é o único planeta com vida conhecida?', options: ['Terra', 'Marte', 'Vênus', 'Júpiter'], correct: 'Terra', planetRelated: 'Terra' },
  { question: 'Qual planeta gira deitado?', options: ['Urano', 'Netuno', 'Saturno', 'Júpiter'], correct: 'Urano', planetRelated: 'Urano' },
  { question: 'Qual é o 4º planeta a partir do Sol?', options: ['Marte', 'Terra', 'Júpiter', 'Vênus'], correct: 'Marte', planetRelated: 'Marte' },
];

const MEDIUM_QUESTIONS: SolarQuestion[] = [
  { question: 'Quais planetas são rochosos?', options: ['Mercúrio, Vênus, Terra e Marte', 'Júpiter, Saturno, Urano e Netuno', 'Terra, Marte, Júpiter e Saturno', 'Mercúrio, Terra, Saturno e Netuno'], correct: 'Mercúrio, Vênus, Terra e Marte', hint: 'São os 4 mais próximos do Sol' },
  { question: 'Quais planetas são gasosos?', options: ['Júpiter, Saturno, Urano e Netuno', 'Mercúrio, Vênus, Terra e Marte', 'Marte, Júpiter, Saturno e Urano', 'Vênus, Terra, Júpiter e Saturno'], correct: 'Júpiter, Saturno, Urano e Netuno', hint: 'São os 4 mais distantes do Sol' },
  { question: 'Qual planeta vem depois de Marte?', options: ['Júpiter', 'Saturno', 'Terra', 'Urano'], correct: 'Júpiter', hint: 'É o maior planeta' },
  { question: 'Qual planeta vem antes de Saturno?', options: ['Júpiter', 'Urano', 'Marte', 'Netuno'], correct: 'Júpiter' },
  { question: 'Mercúrio é um planeta rochoso ou gasoso?', options: ['Rochoso', 'Gasoso'], correct: 'Rochoso', planetRelated: 'Mercúrio' },
  { question: 'Saturno é um planeta rochoso ou gasoso?', options: ['Gasoso', 'Rochoso'], correct: 'Gasoso', planetRelated: 'Saturno' },
  { question: 'Qual planeta possui a Grande Mancha Vermelha?', options: ['Júpiter', 'Marte', 'Vênus', 'Netuno'], correct: 'Júpiter', planetRelated: 'Júpiter', hint: 'É uma tempestade gigante' },
  { question: 'Qual planeta tem o maior vulcão do Sistema Solar?', options: ['Marte', 'Terra', 'Vênus', 'Júpiter'], correct: 'Marte', planetRelated: 'Marte', hint: 'Monte Olimpo' },
  { question: 'Qual planeta vem depois da Terra?', options: ['Marte', 'Vênus', 'Júpiter', 'Mercúrio'], correct: 'Marte' },
  { question: 'Qual planeta vem antes da Terra?', options: ['Vênus', 'Mercúrio', 'Marte', 'Júpiter'], correct: 'Vênus' },
  { question: 'Qual planeta tem mais de 90 luas?', options: ['Júpiter', 'Saturno', 'Urano', 'Netuno'], correct: 'Júpiter', planetRelated: 'Júpiter' },
  { question: 'Qual característica é de Urano?', options: ['Gira de lado', 'Tem anéis famosos', 'É o mais quente', 'É o menor'], correct: 'Gira de lado', planetRelated: 'Urano' },
  { question: 'Qual planeta flutuaria na água?', options: ['Saturno', 'Júpiter', 'Urano', 'Netuno'], correct: 'Saturno', planetRelated: 'Saturno', hint: 'É menos denso que a água' },
  { question: 'Quantos planetas rochosos existem no Sistema Solar?', options: ['4', '3', '5', '6'], correct: '4' },
  { question: 'Qual planeta gira ao contrário dos outros?', options: ['Vênus', 'Urano', 'Marte', 'Netuno'], correct: 'Vênus', planetRelated: 'Vênus' },
  { question: 'Qual planeta tem os ventos mais fortes?', options: ['Netuno', 'Júpiter', 'Saturno', 'Urano'], correct: 'Netuno', planetRelated: 'Netuno' },
];

const HARD_QUESTIONS: SolarQuestion[] = [
  { question: 'Qual a ordem correta dos 4 primeiros planetas?', options: ['Mercúrio, Vênus, Terra, Marte', 'Vênus, Mercúrio, Terra, Marte', 'Mercúrio, Terra, Vênus, Marte', 'Terra, Vênus, Mercúrio, Marte'], correct: 'Mercúrio, Vênus, Terra, Marte' },
  { question: 'Qual a ordem correta dos 4 últimos planetas?', options: ['Júpiter, Saturno, Urano, Netuno', 'Saturno, Júpiter, Urano, Netuno', 'Júpiter, Saturno, Netuno, Urano', 'Saturno, Júpiter, Netuno, Urano'], correct: 'Júpiter, Saturno, Urano, Netuno' },
  { question: 'Verdadeiro ou Falso: Mercúrio é o planeta mais quente.', options: ['Falso', 'Verdadeiro'], correct: 'Falso', hint: 'Vênus é o mais quente por causa da atmosfera densa' },
  { question: 'Verdadeiro ou Falso: Saturno flutuaria na água.', options: ['Verdadeiro', 'Falso'], correct: 'Verdadeiro', hint: 'Sua densidade é menor que a da água' },
  { question: 'Verdadeiro ou Falso: A Terra é o maior planeta rochoso.', options: ['Verdadeiro', 'Falso'], correct: 'Verdadeiro' },
  { question: 'Qual é o 6º planeta a partir do Sol?', options: ['Saturno', 'Urano', 'Júpiter', 'Netuno'], correct: 'Saturno' },
  { question: 'Qual é o 7º planeta a partir do Sol?', options: ['Urano', 'Netuno', 'Saturno', 'Júpiter'], correct: 'Urano' },
  { question: 'Qual planeta NÃO possui lua?', options: ['Mercúrio', 'Marte', 'Júpiter', 'Terra'], correct: 'Mercúrio', planetRelated: 'Mercúrio' },
  { question: 'Qual é a cor de Urano?', options: ['Azul-esverdeada', 'Vermelha', 'Amarela', 'Laranja'], correct: 'Azul-esverdeada', planetRelated: 'Urano' },
  { question: 'Qual destes eventos acontece em Netuno?', options: ['Ventos de até 2.100 km/h', 'Chuva de diamantes', 'Tempestade do tamanho da Terra', 'Todas as anteriores'], correct: 'Ventos de até 2.100 km/h', planetRelated: 'Netuno' },
  { question: 'Quanto tempo dura um dia em Mercúrio (em dias terrestres)?', options: ['59 dias', '10 dias', '1 dia', '365 dias'], correct: '59 dias', planetRelated: 'Mercúrio' },
  { question: 'Por que Vênus é mais quente que Mercúrio?', options: ['Atmosfera densa retém calor', 'Está mais próximo do Sol', 'Tem mais vulcões', 'Gira mais devagar'], correct: 'Atmosfera densa retém calor', planetRelated: 'Vênus' },
  { question: 'Qual planeta possui o Monte Olimpo?', options: ['Marte', 'Júpiter', 'Terra', 'Vênus'], correct: 'Marte', planetRelated: 'Marte' },
  { question: 'Quantas luas a Terra possui?', options: ['1', '2', '0', '3'], correct: '1', planetRelated: 'Terra' },
  { question: 'Verdadeiro ou Falso: Todos os planetas gasosos possuem anéis.', options: ['Verdadeiro', 'Falso'], correct: 'Verdadeiro', hint: 'Júpiter, Saturno, Urano e Netuno possuem anéis' },
  { question: 'Qual planeta tem nome que NÃO vem de um deus?', options: ['Terra', 'Marte', 'Vênus', 'Mercúrio'], correct: 'Terra', planetRelated: 'Terra' },
];

export const QUESTIONS_BY_DIFFICULTY: Record<Difficulty, SolarQuestion[]> = {
  easy: EASY_QUESTIONS,
  medium: MEDIUM_QUESTIONS,
  hard: HARD_QUESTIONS,
};

export function getQuestionsForDifficulty(difficulty: Difficulty, count: number): SolarQuestion[] {
  const pool = [...QUESTIONS_BY_DIFFICULTY[difficulty]];
  const shuffled: SolarQuestion[] = [];
  while (shuffled.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    shuffled.push(pool.splice(idx, 1)[0]);
  }
  return shuffled;
}

export function getPlanetByName(name: string): Planet | undefined {
  return PLANETS.find((p) => p.name === name);
}
