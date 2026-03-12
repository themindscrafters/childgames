import type { Difficulty } from '../../../../data/models';

export interface Organ {
  name: string;
  emoji: string;
  system: string;
  functions: string[];
  funFact: string;
}

export interface BodyQuestion {
  question: string;
  options: string[];
  correct: string;
  hint?: string;
  organRelated?: string;
}

export const ORGANS: Organ[] = [
  {
    name: 'Coração',
    emoji: '❤️',
    system: 'Circulatório',
    functions: ['Bombear sangue para todo o corpo', 'Manter a circulação sanguínea'],
    funFact: 'O coração bate cerca de 100 mil vezes por dia!',
  },
  {
    name: 'Pulmões',
    emoji: '🫁',
    system: 'Respiratório',
    functions: ['Realizar trocas gasosas', 'Absorver oxigênio e eliminar gás carbônico'],
    funFact: 'Se abríssemos todos os alvéolos, teriam a área de uma quadra de tênis!',
  },
  {
    name: 'Cérebro',
    emoji: '🧠',
    system: 'Nervoso',
    functions: ['Controlar todo o corpo', 'Processar informações e pensamentos', 'Armazenar memórias'],
    funFact: 'O cérebro usa 20% de toda a energia do corpo!',
  },
  {
    name: 'Estômago',
    emoji: '🫃',
    system: 'Digestório',
    functions: ['Digerir alimentos com suco gástrico', 'Transformar comida em nutrientes'],
    funFact: 'O estômago produz um novo revestimento a cada 3-4 dias!',
  },
  {
    name: 'Fígado',
    emoji: '🟤',
    system: 'Digestório',
    functions: ['Filtrar toxinas do sangue', 'Produzir bile para digestão', 'Armazenar energia'],
    funFact: 'O fígado é o único órgão que consegue se regenerar!',
  },
  {
    name: 'Rins',
    emoji: '🫘',
    system: 'Excretor',
    functions: ['Filtrar o sangue', 'Produzir urina', 'Eliminar resíduos do corpo'],
    funFact: 'Os rins filtram todo o sangue do corpo cerca de 40 vezes por dia!',
  },
  {
    name: 'Intestinos',
    emoji: '🌀',
    system: 'Digestório',
    functions: ['Absorver nutrientes dos alimentos', 'Eliminar resíduos sólidos'],
    funFact: 'O intestino delgado tem cerca de 7 metros de comprimento!',
  },
  {
    name: 'Pele',
    emoji: '🤲',
    system: 'Tegumentar',
    functions: ['Proteger o corpo', 'Regular a temperatura', 'Perceber o toque'],
    funFact: 'A pele é o maior órgão do corpo humano!',
  },
  {
    name: 'Ossos',
    emoji: '🦴',
    system: 'Esquelético',
    functions: ['Sustentar o corpo', 'Proteger órgãos internos', 'Produzir células sanguíneas'],
    funFact: 'Um bebê nasce com cerca de 270 ossos, mas um adulto tem apenas 206!',
  },
  {
    name: 'Músculos',
    emoji: '💪',
    system: 'Muscular',
    functions: ['Permitir movimentos', 'Manter a postura', 'Gerar calor corporal'],
    funFact: 'O corpo humano tem mais de 600 músculos!',
  },
];

export const SYSTEMS = [
  { name: 'Circulatório', emoji: '❤️', description: 'Transporta sangue, oxigênio e nutrientes pelo corpo' },
  { name: 'Respiratório', emoji: '🫁', description: 'Responsável pela respiração e troca de gases' },
  { name: 'Nervoso', emoji: '🧠', description: 'Controla e coordena todas as funções do corpo' },
  { name: 'Digestório', emoji: '🍽️', description: 'Transforma alimentos em nutrientes para o corpo' },
  { name: 'Excretor', emoji: '🫘', description: 'Elimina resíduos e substâncias tóxicas do corpo' },
  { name: 'Muscular', emoji: '💪', description: 'Permite os movimentos do corpo' },
  { name: 'Esquelético', emoji: '🦴', description: 'Sustenta e protege o corpo' },
  { name: 'Tegumentar', emoji: '🤲', description: 'Reveste e protege o corpo externamente' },
];

const EASY_QUESTIONS: BodyQuestion[] = [
  { question: 'Qual órgão bombeia sangue para todo o corpo?', options: ['Coração', 'Pulmões', 'Cérebro', 'Rins'], correct: 'Coração', organRelated: 'Coração', hint: 'Fica no peito e bate sem parar' },
  { question: 'Qual órgão usamos para respirar?', options: ['Pulmões', 'Estômago', 'Fígado', 'Coração'], correct: 'Pulmões', organRelated: 'Pulmões', hint: 'Temos dois deles no peito' },
  { question: 'Qual órgão controla nossos pensamentos?', options: ['Cérebro', 'Coração', 'Estômago', 'Pulmões'], correct: 'Cérebro', organRelated: 'Cérebro', hint: 'Fica dentro da cabeça' },
  { question: 'Qual órgão digere os alimentos?', options: ['Estômago', 'Coração', 'Pulmões', 'Cérebro'], correct: 'Estômago', organRelated: 'Estômago', hint: 'Fica na barriga' },
  { question: 'Qual é o maior órgão do corpo humano?', options: ['Pele', 'Fígado', 'Intestinos', 'Pulmões'], correct: 'Pele', organRelated: 'Pele', hint: 'Cobre todo o nosso corpo' },
  { question: 'O que sustenta e dá forma ao nosso corpo?', options: ['Ossos', 'Músculos', 'Pele', 'Coração'], correct: 'Ossos', organRelated: 'Ossos', hint: 'O esqueleto é feito deles' },
  { question: 'O que nos permite mexer braços e pernas?', options: ['Músculos', 'Ossos', 'Pele', 'Cérebro'], correct: 'Músculos', organRelated: 'Músculos', hint: 'Ficam mais fortes com exercícios' },
  { question: 'Qual órgão filtra o sangue e produz urina?', options: ['Rins', 'Fígado', 'Coração', 'Estômago'], correct: 'Rins', organRelated: 'Rins', hint: 'Temos dois, um de cada lado' },
  { question: 'Qual órgão absorve os nutrientes dos alimentos?', options: ['Intestinos', 'Estômago', 'Fígado', 'Pulmões'], correct: 'Intestinos', organRelated: 'Intestinos', hint: 'É bem comprido e fica na barriga' },
  { question: 'Qual órgão filtra toxinas e produz bile?', options: ['Fígado', 'Rins', 'Coração', 'Estômago'], correct: 'Fígado', organRelated: 'Fígado', hint: 'É o único órgão que se regenera' },
  { question: 'O coração faz parte de qual sistema?', options: ['Circulatório', 'Respiratório', 'Nervoso', 'Digestório'], correct: 'Circulatório', organRelated: 'Coração' },
  { question: 'Os pulmões fazem parte de qual sistema?', options: ['Respiratório', 'Circulatório', 'Digestório', 'Nervoso'], correct: 'Respiratório', organRelated: 'Pulmões' },
  { question: 'O cérebro faz parte de qual sistema?', options: ['Nervoso', 'Circulatório', 'Respiratório', 'Muscular'], correct: 'Nervoso', organRelated: 'Cérebro' },
  { question: 'Quantos pulmões temos?', options: ['2', '1', '3', '4'], correct: '2', organRelated: 'Pulmões' },
  { question: 'Quantos rins temos?', options: ['2', '1', '3', '4'], correct: '2', organRelated: 'Rins' },
  { question: 'Onde fica o cérebro?', options: ['Na cabeça', 'No peito', 'Na barriga', 'Nas costas'], correct: 'Na cabeça', organRelated: 'Cérebro' },
];

const MEDIUM_QUESTIONS: BodyQuestion[] = [
  { question: 'Qual sistema é responsável por transportar sangue?', options: ['Circulatório', 'Respiratório', 'Nervoso', 'Excretor'], correct: 'Circulatório', hint: 'O coração é o órgão principal desse sistema' },
  { question: 'O estômago faz parte de qual sistema?', options: ['Digestório', 'Circulatório', 'Respiratório', 'Excretor'], correct: 'Digestório', organRelated: 'Estômago' },
  { question: 'Os rins fazem parte de qual sistema?', options: ['Excretor', 'Digestório', 'Circulatório', 'Nervoso'], correct: 'Excretor', organRelated: 'Rins' },
  { question: 'Qual sistema permite que nos movimentemos?', options: ['Muscular', 'Nervoso', 'Esquelético', 'Respiratório'], correct: 'Muscular' },
  { question: 'Qual órgão armazena memórias?', options: ['Cérebro', 'Coração', 'Fígado', 'Pulmões'], correct: 'Cérebro', organRelated: 'Cérebro', hint: 'É o centro de comando do corpo' },
  { question: 'Qual órgão produz bile para ajudar na digestão?', options: ['Fígado', 'Estômago', 'Intestinos', 'Rins'], correct: 'Fígado', organRelated: 'Fígado' },
  { question: 'Qual sistema protege os órgãos internos com uma estrutura rígida?', options: ['Esquelético', 'Muscular', 'Tegumentar', 'Nervoso'], correct: 'Esquelético' },
  { question: 'Qual a função principal dos pulmões?', options: ['Realizar trocas gasosas', 'Bombear sangue', 'Digerir alimentos', 'Filtrar toxinas'], correct: 'Realizar trocas gasosas', organRelated: 'Pulmões' },
  { question: 'Qual sistema regula a temperatura do corpo?', options: ['Tegumentar', 'Muscular', 'Nervoso', 'Circulatório'], correct: 'Tegumentar', hint: 'A pele é o principal órgão deste sistema' },
  { question: 'Qual órgão consegue se regenerar?', options: ['Fígado', 'Coração', 'Cérebro', 'Rins'], correct: 'Fígado', organRelated: 'Fígado' },
  { question: 'O intestino delgado tem aproximadamente quantos metros?', options: ['7 metros', '2 metros', '15 metros', '1 metro'], correct: '7 metros', organRelated: 'Intestinos' },
  { question: 'Qual sistema coordena todas as funções do corpo?', options: ['Nervoso', 'Circulatório', 'Digestório', 'Muscular'], correct: 'Nervoso' },
  { question: 'O que os ossos produzem em sua medula?', options: ['Células sanguíneas', 'Bile', 'Urina', 'Suor'], correct: 'Células sanguíneas', organRelated: 'Ossos' },
  { question: 'Qual órgão usa 20% da energia do corpo?', options: ['Cérebro', 'Coração', 'Músculos', 'Fígado'], correct: 'Cérebro', organRelated: 'Cérebro' },
  { question: 'Quais órgãos fazem parte do sistema digestório?', options: ['Estômago, fígado e intestinos', 'Coração e pulmões', 'Cérebro e nervos', 'Rins e bexiga'], correct: 'Estômago, fígado e intestinos' },
  { question: 'O que o coração transporta pelo corpo?', options: ['Sangue com oxigênio e nutrientes', 'Ar e gás carbônico', 'Bile e suco gástrico', 'Urina e toxinas'], correct: 'Sangue com oxigênio e nutrientes', organRelated: 'Coração' },
];

const HARD_QUESTIONS: BodyQuestion[] = [
  { question: 'Quantas vezes o coração bate por dia aproximadamente?', options: ['100 mil vezes', '10 mil vezes', '1 milhão de vezes', '50 mil vezes'], correct: '100 mil vezes', organRelated: 'Coração' },
  { question: 'Quantos ossos tem um adulto?', options: ['206', '270', '150', '300'], correct: '206', organRelated: 'Ossos', hint: 'Bebês nascem com mais ossos que se fundem' },
  { question: 'Quantos músculos o corpo humano possui aproximadamente?', options: ['Mais de 600', 'Cerca de 200', 'Cerca de 100', 'Mais de 1000'], correct: 'Mais de 600', organRelated: 'Músculos' },
  { question: 'Por que bebês têm mais ossos que adultos?', options: ['Porque alguns ossos se fundem com o crescimento', 'Porque adultos perdem ossos', 'Porque bebês têm ossos extras', 'Porque os ossos encolhem'], correct: 'Porque alguns ossos se fundem com o crescimento', organRelated: 'Ossos' },
  { question: 'Qual órgão produz suco gástrico para a digestão?', options: ['Estômago', 'Fígado', 'Intestino delgado', 'Pâncreas'], correct: 'Estômago', organRelated: 'Estômago' },
  { question: 'Quantas vezes por dia os rins filtram todo o sangue do corpo?', options: ['Cerca de 40 vezes', 'Apenas 1 vez', '5 vezes', '100 vezes'], correct: 'Cerca de 40 vezes', organRelated: 'Rins' },
  { question: 'Qual é a relação entre o sistema circulatório e o respiratório?', options: ['O sangue leva oxigênio dos pulmões para o corpo', 'Não têm relação', 'O coração produz oxigênio', 'Os pulmões bombeiam sangue'], correct: 'O sangue leva oxigênio dos pulmões para o corpo' },
  { question: 'O que aconteceria se o sistema nervoso parasse de funcionar?', options: ['O corpo não conseguiria se mover nem pensar', 'Apenas os olhos parariam', 'Nada de grave', 'Só afetaria os músculos'], correct: 'O corpo não conseguiria se mover nem pensar' },
  { question: 'Qual a função da medula óssea?', options: ['Produzir células sanguíneas', 'Transmitir impulsos nervosos', 'Digerir alimentos', 'Filtrar o sangue'], correct: 'Produzir células sanguíneas', organRelated: 'Ossos' },
  { question: 'Qual sistema trabalha junto com o esquelético para permitir movimentos?', options: ['Muscular', 'Digestório', 'Respiratório', 'Excretor'], correct: 'Muscular' },
  { question: 'Qual gás o corpo absorve na respiração?', options: ['Oxigênio', 'Gás carbônico', 'Nitrogênio', 'Hidrogênio'], correct: 'Oxigênio', organRelated: 'Pulmões' },
  { question: 'Qual gás o corpo elimina na respiração?', options: ['Gás carbônico', 'Oxigênio', 'Nitrogênio', 'Hélio'], correct: 'Gás carbônico', organRelated: 'Pulmões' },
  { question: 'Verdadeiro ou Falso: A pele é um órgão.', options: ['Verdadeiro', 'Falso'], correct: 'Verdadeiro', organRelated: 'Pele' },
  { question: 'Qual é a principal diferença entre intestino delgado e grosso?', options: ['O delgado absorve nutrientes, o grosso absorve água', 'O grosso é menor que o delgado', 'Não há diferença', 'O delgado elimina fezes'], correct: 'O delgado absorve nutrientes, o grosso absorve água', organRelated: 'Intestinos' },
  { question: 'Qual órgão do sistema digestório armazena energia em forma de glicogênio?', options: ['Fígado', 'Estômago', 'Intestino', 'Pâncreas'], correct: 'Fígado', organRelated: 'Fígado' },
  { question: 'O que são alvéolos pulmonares?', options: ['Pequenas bolsas nos pulmões onde ocorrem trocas gasosas', 'Ossos do pulmão', 'Músculos do peito', 'Vasos sanguíneos do coração'], correct: 'Pequenas bolsas nos pulmões onde ocorrem trocas gasosas', organRelated: 'Pulmões' },
];

export const QUESTIONS_BY_DIFFICULTY: Record<Difficulty, BodyQuestion[]> = {
  easy: EASY_QUESTIONS,
  medium: MEDIUM_QUESTIONS,
  hard: HARD_QUESTIONS,
};

export function getQuestionsForDifficulty(difficulty: Difficulty, count: number): BodyQuestion[] {
  const pool = [...QUESTIONS_BY_DIFFICULTY[difficulty]];
  const shuffled: BodyQuestion[] = [];
  while (shuffled.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    shuffled.push(pool.splice(idx, 1)[0]);
  }
  return shuffled;
}

export function getOrganByName(name: string): Organ | undefined {
  return ORGANS.find((o) => o.name === name);
}
