import type { Difficulty } from '../../../../data/models';

export interface HistoricalEvent {
  event: string;
  year: number;
  description: string;
  emoji: string;
  period: string;
}

export interface TimelineQuestion {
  question: string;
  options: string[];
  correct: string;
  relatedEvent?: string;
  hint?: string;
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    event: 'Descobrimento do Brasil',
    year: 1500,
    description: 'Pedro Álvares Cabral chegou ao Brasil com sua frota portuguesa.',
    emoji: '⛵',
    period: 'Período Colonial',
  },
  {
    event: 'Chegada dos africanos escravizados',
    year: 1538,
    description: 'Os primeiros africanos escravizados chegaram ao Brasil para trabalhar nos engenhos de açúcar.',
    emoji: '⛓️',
    period: 'Período Colonial',
  },
  {
    event: 'Invasão Holandesa',
    year: 1630,
    description: 'Os holandeses invadiram o Nordeste do Brasil e ficaram por 24 anos.',
    emoji: '🏴',
    period: 'Período Colonial',
  },
  {
    event: 'Inconfidência Mineira',
    year: 1789,
    description: 'Movimento liderado por Tiradentes que lutou pela independência de Minas Gerais.',
    emoji: '🗽',
    period: 'Período Colonial',
  },
  {
    event: 'Chegada da Família Real',
    year: 1808,
    description: 'A família real portuguesa fugiu de Napoleão e veio morar no Brasil.',
    emoji: '👑',
    period: 'Período Colonial',
  },
  {
    event: 'Independência do Brasil',
    year: 1822,
    description: 'Dom Pedro I declarou a independência do Brasil às margens do rio Ipiranga.',
    emoji: '🇧🇷',
    period: 'Período Imperial',
  },
  {
    event: 'Abolição da Escravatura',
    year: 1888,
    description: 'A Princesa Isabel assinou a Lei Áurea, libertando todos os escravizados.',
    emoji: '✊',
    period: 'Período Imperial',
  },
  {
    event: 'Proclamação da República',
    year: 1889,
    description: 'Marechal Deodoro da Fonseca proclamou a República, acabando com a monarquia.',
    emoji: '🏛️',
    period: 'Período Republicano',
  },
  {
    event: 'Era Vargas',
    year: 1930,
    description: 'Getúlio Vargas assumiu o poder e governou o Brasil por muitos anos.',
    emoji: '🎩',
    period: 'Período Republicano',
  },
  {
    event: 'Inauguração de Brasília',
    year: 1960,
    description: 'Juscelino Kubitschek inaugurou Brasília como a nova capital do Brasil.',
    emoji: '🏗️',
    period: 'Período Republicano',
  },
];

const EASY_QUESTIONS: TimelineQuestion[] = [
  { question: 'Em que ano o Brasil foi descoberto?', options: ['1500', '1822', '1888', '1889'], correct: '1500', relatedEvent: 'Descobrimento do Brasil', hint: 'Pedro Álvares Cabral chegou ao Brasil' },
  { question: 'O que aconteceu em 1822?', options: ['Independência do Brasil', 'Descobrimento do Brasil', 'Proclamação da República', 'Abolição da Escravatura'], correct: 'Independência do Brasil', relatedEvent: 'Independência do Brasil', hint: 'Dom Pedro I disse "Independência ou morte!"' },
  { question: 'O que aconteceu em 1888?', options: ['Abolição da Escravatura', 'Independência do Brasil', 'Descobrimento do Brasil', 'Proclamação da República'], correct: 'Abolição da Escravatura', relatedEvent: 'Abolição da Escravatura', hint: 'A Lei Áurea foi assinada' },
  { question: 'O que aconteceu em 1889?', options: ['Proclamação da República', 'Abolição da Escravatura', 'Independência do Brasil', 'Era Vargas'], correct: 'Proclamação da República', relatedEvent: 'Proclamação da República', hint: 'A monarquia acabou no Brasil' },
  { question: 'Quem descobriu o Brasil?', options: ['Pedro Álvares Cabral', 'Dom Pedro I', 'Tiradentes', 'Princesa Isabel'], correct: 'Pedro Álvares Cabral', relatedEvent: 'Descobrimento do Brasil' },
  { question: 'Quem declarou a independência do Brasil?', options: ['Dom Pedro I', 'Pedro Álvares Cabral', 'Tiradentes', 'Getúlio Vargas'], correct: 'Dom Pedro I', relatedEvent: 'Independência do Brasil' },
  { question: 'Quem assinou a Lei Áurea?', options: ['Princesa Isabel', 'Dom Pedro I', 'Pedro Álvares Cabral', 'Deodoro da Fonseca'], correct: 'Princesa Isabel', relatedEvent: 'Abolição da Escravatura' },
  { question: 'Qual é a capital do Brasil desde 1960?', options: ['Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'], correct: 'Brasília', relatedEvent: 'Inauguração de Brasília' },
  { question: 'Em que ano Brasília foi inaugurada?', options: ['1960', '1950', '1970', '1930'], correct: '1960', relatedEvent: 'Inauguração de Brasília' },
  { question: 'O que a Lei Áurea fez?', options: ['Libertou os escravizados', 'Declarou a independência', 'Criou a República', 'Descobriu o Brasil'], correct: 'Libertou os escravizados', relatedEvent: 'Abolição da Escravatura' },
  { question: 'Em que ano começou a Era Vargas?', options: ['1930', '1960', '1822', '1500'], correct: '1930', relatedEvent: 'Era Vargas' },
  { question: 'Quem proclamou a República?', options: ['Marechal Deodoro da Fonseca', 'Dom Pedro I', 'Getúlio Vargas', 'Tiradentes'], correct: 'Marechal Deodoro da Fonseca', relatedEvent: 'Proclamação da República' },
  { question: 'De qual país Pedro Álvares Cabral veio?', options: ['Portugal', 'Espanha', 'Inglaterra', 'França'], correct: 'Portugal', relatedEvent: 'Descobrimento do Brasil' },
  { question: 'O que aconteceu em 1500?', options: ['Descobrimento do Brasil', 'Independência do Brasil', 'Abolição da Escravatura', 'Proclamação da República'], correct: 'Descobrimento do Brasil', relatedEvent: 'Descobrimento do Brasil' },
  { question: 'O que aconteceu em 1930?', options: ['Getúlio Vargas assumiu o poder', 'Brasília foi inaugurada', 'Brasil ficou independente', 'Escravatura foi abolida'], correct: 'Getúlio Vargas assumiu o poder', relatedEvent: 'Era Vargas' },
  { question: 'Quem foi Tiradentes?', options: ['Líder da Inconfidência Mineira', 'Primeiro presidente', 'Descobridor do Brasil', 'Último imperador'], correct: 'Líder da Inconfidência Mineira', relatedEvent: 'Inconfidência Mineira' },
];

const MEDIUM_QUESTIONS: TimelineQuestion[] = [
  { question: 'O que veio primeiro: Independência ou Abolição?', options: ['Independência (1822)', 'Abolição (1888)'], correct: 'Independência (1822)', hint: 'A Independência foi 66 anos antes' },
  { question: 'O que veio primeiro: Descobrimento ou Inconfidência Mineira?', options: ['Descobrimento (1500)', 'Inconfidência Mineira (1789)'], correct: 'Descobrimento (1500)' },
  { question: 'O que veio primeiro: Abolição ou Proclamação da República?', options: ['Abolição (1888)', 'Proclamação da República (1889)'], correct: 'Abolição (1888)', hint: 'Aconteceram com apenas 1 ano de diferença!' },
  { question: 'O que veio primeiro: Era Vargas ou Inauguração de Brasília?', options: ['Era Vargas (1930)', 'Inauguração de Brasília (1960)'], correct: 'Era Vargas (1930)' },
  { question: 'Em que século o Brasil foi descoberto?', options: ['Século XVI', 'Século XV', 'Século XVII', 'Século XIX'], correct: 'Século XVI', relatedEvent: 'Descobrimento do Brasil', hint: '1500 pertence ao século XVI' },
  { question: 'A Independência do Brasil aconteceu em que século?', options: ['Século XIX', 'Século XVIII', 'Século XX', 'Século XVI'], correct: 'Século XIX', relatedEvent: 'Independência do Brasil' },
  { question: 'Qual evento está relacionado a Tiradentes?', options: ['Inconfidência Mineira', 'Independência do Brasil', 'Proclamação da República', 'Abolição da Escravatura'], correct: 'Inconfidência Mineira', relatedEvent: 'Inconfidência Mineira' },
  { question: 'Por que a família real portuguesa veio ao Brasil?', options: ['Fugindo de Napoleão', 'Para descobrir ouro', 'Para fundar Brasília', 'Para abolir a escravatura'], correct: 'Fugindo de Napoleão', relatedEvent: 'Chegada da Família Real' },
  { question: 'Os holandeses invadiram qual região do Brasil?', options: ['Nordeste', 'Sudeste', 'Sul', 'Norte'], correct: 'Nordeste', relatedEvent: 'Invasão Holandesa' },
  { question: 'Quem construiu Brasília?', options: ['Juscelino Kubitschek', 'Getúlio Vargas', 'Dom Pedro II', 'Marechal Deodoro'], correct: 'Juscelino Kubitschek', relatedEvent: 'Inauguração de Brasília' },
  { question: 'Qual era o sistema de governo antes da República?', options: ['Monarquia', 'Democracia', 'Ditadura', 'Parlamentarismo'], correct: 'Monarquia' },
  { question: 'Onde Dom Pedro I declarou a independência?', options: ['Às margens do rio Ipiranga', 'No Rio de Janeiro', 'Em Brasília', 'Em Salvador'], correct: 'Às margens do rio Ipiranga', relatedEvent: 'Independência do Brasil' },
  { question: 'Qual período da história veio primeiro: Colonial ou Imperial?', options: ['Colonial', 'Imperial'], correct: 'Colonial' },
  { question: 'Quantos anos o Brasil foi colônia de Portugal (aproximadamente)?', options: ['322 anos', '100 anos', '500 anos', '50 anos'], correct: '322 anos', hint: 'De 1500 até 1822' },
  { question: 'Para que os africanos escravizados foram trazidos ao Brasil?', options: ['Para trabalhar nos engenhos de açúcar', 'Para explorar ouro', 'Para construir Brasília', 'Para lutar guerras'], correct: 'Para trabalhar nos engenhos de açúcar', relatedEvent: 'Chegada dos africanos escravizados' },
  { question: 'A Proclamação da República acabou com o quê?', options: ['A monarquia no Brasil', 'A escravatura', 'O período colonial', 'A Era Vargas'], correct: 'A monarquia no Brasil', relatedEvent: 'Proclamação da República' },
];

const HARD_QUESTIONS: TimelineQuestion[] = [
  { question: 'Coloque em ordem: Independência, Descobrimento, Abolição', options: ['Descobrimento → Independência → Abolição', 'Independência → Descobrimento → Abolição', 'Abolição → Independência → Descobrimento', 'Descobrimento → Abolição → Independência'], correct: 'Descobrimento → Independência → Abolição' },
  { question: 'Coloque em ordem: Proclamação da República, Era Vargas, Brasília', options: ['República → Vargas → Brasília', 'Vargas → República → Brasília', 'Brasília → Vargas → República', 'República → Brasília → Vargas'], correct: 'República → Vargas → Brasília' },
  { question: 'Coloque em ordem: Família Real, Inconfidência, Independência', options: ['Inconfidência → Família Real → Independência', 'Família Real → Inconfidência → Independência', 'Independência → Inconfidência → Família Real', 'Inconfidência → Independência → Família Real'], correct: 'Inconfidência → Família Real → Independência' },
  { question: 'Quantos anos separam a Abolição da Proclamação da República?', options: ['1 ano', '10 anos', '50 anos', '5 anos'], correct: '1 ano', hint: '1888 e 1889' },
  { question: 'Quantos anos separam o Descobrimento da Independência?', options: ['322 anos', '200 anos', '400 anos', '100 anos'], correct: '322 anos', hint: '1500 até 1822' },
  { question: 'A Inconfidência Mineira lutava por quê?', options: ['Pela independência de Minas Gerais e contra impostos abusivos', 'Pela abolição da escravatura', 'Pela proclamação da república', 'Pela construção de Brasília'], correct: 'Pela independência de Minas Gerais e contra impostos abusivos', relatedEvent: 'Inconfidência Mineira' },
  { question: 'Por que a chegada da família real foi importante?', options: ['Abriu os portos e trouxe desenvolvimento ao Brasil', 'Descobriu novas terras', 'Acabou com a escravatura', 'Proclamou a república'], correct: 'Abriu os portos e trouxe desenvolvimento ao Brasil', relatedEvent: 'Chegada da Família Real' },
  { question: 'Qual foi a consequência direta da Proclamação da República?', options: ['O Brasil deixou de ser uma monarquia', 'Os escravizados foram libertados', 'O Brasil ficou independente', 'Brasília foi construída'], correct: 'O Brasil deixou de ser uma monarquia', relatedEvent: 'Proclamação da República' },
  { question: 'Qual evento aconteceu entre 1822 e 1889?', options: ['Abolição da Escravatura (1888)', 'Descobrimento do Brasil', 'Era Vargas', 'Inauguração de Brasília'], correct: 'Abolição da Escravatura (1888)' },
  { question: 'A invasão holandesa aconteceu em qual período?', options: ['Período Colonial', 'Período Imperial', 'Período Republicano', 'Era Vargas'], correct: 'Período Colonial', relatedEvent: 'Invasão Holandesa' },
  { question: 'Qual capital do Brasil veio antes de Brasília?', options: ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Recife'], correct: 'Rio de Janeiro', hint: 'Foi capital por muitos anos até 1960' },
  { question: 'Verdadeiro ou Falso: A Abolição aconteceu antes da Independência.', options: ['Falso', 'Verdadeiro'], correct: 'Falso', hint: 'Independência: 1822, Abolição: 1888' },
  { question: 'Verdadeiro ou Falso: Getúlio Vargas governou antes da inauguração de Brasília.', options: ['Verdadeiro', 'Falso'], correct: 'Verdadeiro' },
  { question: 'Quem era o presidente que inaugurou Brasília?', options: ['Juscelino Kubitschek', 'Getúlio Vargas', 'Marechal Deodoro da Fonseca', 'Dom Pedro II'], correct: 'Juscelino Kubitschek', relatedEvent: 'Inauguração de Brasília' },
  { question: 'Qual destes eventos pertence ao Período Imperial?', options: ['Abolição da Escravatura', 'Descobrimento do Brasil', 'Era Vargas', 'Invasão Holandesa'], correct: 'Abolição da Escravatura' },
  { question: 'Os holandeses ficaram no Brasil por aproximadamente quantos anos?', options: ['24 anos', '100 anos', '10 anos', '50 anos'], correct: '24 anos', relatedEvent: 'Invasão Holandesa', hint: 'De 1630 a 1654' },
];

export const QUESTIONS_BY_DIFFICULTY: Record<Difficulty, TimelineQuestion[]> = {
  easy: EASY_QUESTIONS,
  medium: MEDIUM_QUESTIONS,
  hard: HARD_QUESTIONS,
};

export function getQuestionsForDifficulty(difficulty: Difficulty, count: number): TimelineQuestion[] {
  const pool = [...QUESTIONS_BY_DIFFICULTY[difficulty]];
  const shuffled: TimelineQuestion[] = [];
  while (shuffled.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    shuffled.push(pool.splice(idx, 1)[0]);
  }
  return shuffled;
}

export function getEventByName(name: string): HistoricalEvent | undefined {
  return HISTORICAL_EVENTS.find((e) => e.event === name);
}
