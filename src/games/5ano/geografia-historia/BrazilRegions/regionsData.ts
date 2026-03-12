export type Region = 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';

export interface BrazilState {
  name: string;
  abbreviation: string;
  capital: string;
  region: Region;
}

export interface RegionInfo {
  name: Region;
  color: string;
  emoji: string;
  states: BrazilState[];
  characteristics: string[];
}

export interface RegionQuestion {
  question: string;
  options: string[];
  correct: string;
}

const NORTE_STATES: BrazilState[] = [
  { name: 'Acre', abbreviation: 'AC', capital: 'Rio Branco', region: 'Norte' },
  { name: 'Amapa', abbreviation: 'AP', capital: 'Macapa', region: 'Norte' },
  { name: 'Amazonas', abbreviation: 'AM', capital: 'Manaus', region: 'Norte' },
  { name: 'Para', abbreviation: 'PA', capital: 'Belem', region: 'Norte' },
  { name: 'Rondonia', abbreviation: 'RO', capital: 'Porto Velho', region: 'Norte' },
  { name: 'Roraima', abbreviation: 'RR', capital: 'Boa Vista', region: 'Norte' },
  { name: 'Tocantins', abbreviation: 'TO', capital: 'Palmas', region: 'Norte' },
];

const NORDESTE_STATES: BrazilState[] = [
  { name: 'Alagoas', abbreviation: 'AL', capital: 'Maceio', region: 'Nordeste' },
  { name: 'Bahia', abbreviation: 'BA', capital: 'Salvador', region: 'Nordeste' },
  { name: 'Ceara', abbreviation: 'CE', capital: 'Fortaleza', region: 'Nordeste' },
  { name: 'Maranhao', abbreviation: 'MA', capital: 'Sao Luis', region: 'Nordeste' },
  { name: 'Paraiba', abbreviation: 'PB', capital: 'Joao Pessoa', region: 'Nordeste' },
  { name: 'Pernambuco', abbreviation: 'PE', capital: 'Recife', region: 'Nordeste' },
  { name: 'Piaui', abbreviation: 'PI', capital: 'Teresina', region: 'Nordeste' },
  { name: 'Rio Grande do Norte', abbreviation: 'RN', capital: 'Natal', region: 'Nordeste' },
  { name: 'Sergipe', abbreviation: 'SE', capital: 'Aracaju', region: 'Nordeste' },
];

const CENTRO_OESTE_STATES: BrazilState[] = [
  { name: 'Distrito Federal', abbreviation: 'DF', capital: 'Brasilia', region: 'Centro-Oeste' },
  { name: 'Goias', abbreviation: 'GO', capital: 'Goiania', region: 'Centro-Oeste' },
  { name: 'Mato Grosso', abbreviation: 'MT', capital: 'Cuiaba', region: 'Centro-Oeste' },
  { name: 'Mato Grosso do Sul', abbreviation: 'MS', capital: 'Campo Grande', region: 'Centro-Oeste' },
];

const SUDESTE_STATES: BrazilState[] = [
  { name: 'Espirito Santo', abbreviation: 'ES', capital: 'Vitoria', region: 'Sudeste' },
  { name: 'Minas Gerais', abbreviation: 'MG', capital: 'Belo Horizonte', region: 'Sudeste' },
  { name: 'Rio de Janeiro', abbreviation: 'RJ', capital: 'Rio de Janeiro', region: 'Sudeste' },
  { name: 'Sao Paulo', abbreviation: 'SP', capital: 'Sao Paulo', region: 'Sudeste' },
];

const SUL_STATES: BrazilState[] = [
  { name: 'Parana', abbreviation: 'PR', capital: 'Curitiba', region: 'Sul' },
  { name: 'Rio Grande do Sul', abbreviation: 'RS', capital: 'Porto Alegre', region: 'Sul' },
  { name: 'Santa Catarina', abbreviation: 'SC', capital: 'Florianopolis', region: 'Sul' },
];

export const REGIONS: RegionInfo[] = [
  {
    name: 'Norte',
    color: '#22C55E',
    emoji: '\uD83C\uDF33',
    states: NORTE_STATES,
    characteristics: [
      'Maior regiao do Brasil em area',
      'Abriga a Floresta Amazonica',
      'Tem o maior rio do mundo em volume de agua',
      'Clima equatorial quente e umido',
      'Rica em biodiversidade',
    ],
  },
  {
    name: 'Nordeste',
    color: '#F59E0B',
    emoji: '\u2600\uFE0F',
    states: NORDESTE_STATES,
    characteristics: [
      'Regiao com mais estados (9)',
      'Possui belas praias e litoral extenso',
      'Cultura rica com festas como o Carnaval e Sao Joao',
      'Inclui o sertao, com clima semiarido',
      'Primeira regiao colonizada do Brasil',
    ],
  },
  {
    name: 'Centro-Oeste',
    color: '#EF4444',
    emoji: '\uD83C\uDF3E',
    states: CENTRO_OESTE_STATES,
    characteristics: [
      'Abriga a capital do Brasil, Brasilia',
      'Vegetacao predominante de cerrado',
      'Grande producao agricola e pecuaria',
      'Possui o Pantanal, maior area alagada do mundo',
      'Clima tropical com estacao seca bem definida',
    ],
  },
  {
    name: 'Sudeste',
    color: '#3B82F6',
    emoji: '\uD83C\uDFD9\uFE0F',
    states: SUDESTE_STATES,
    characteristics: [
      'Regiao mais populosa e industrializada',
      'Concentra a maior parte da economia do pais',
      'Possui as maiores cidades: Sao Paulo e Rio de Janeiro',
      'Grande diversidade cultural e imigracao',
      'Relevo com serras e planaltos',
    ],
  },
  {
    name: 'Sul',
    color: '#8B5CF6',
    emoji: '\u2744\uFE0F',
    states: SUL_STATES,
    characteristics: [
      'Menor regiao em numero de estados (3)',
      'Clima subtropical com invernos frios',
      'Forte influencia de imigrantes europeus',
      'Producao de vinhos e graos',
      'Possui as Cataratas do Iguacu',
    ],
  },
];

export const ALL_STATES: BrazilState[] = [
  ...NORTE_STATES,
  ...NORDESTE_STATES,
  ...CENTRO_OESTE_STATES,
  ...SUDESTE_STATES,
  ...SUL_STATES,
];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomExcluding<T>(arr: T[], exclude: T): T {
  const filtered = arr.filter((item) => item !== exclude);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function generateDistractorRegions(correct: Region, count: number): string[] {
  const allRegions: Region[] = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];
  const others = allRegions.filter((r) => r !== correct);
  const distractors = shuffle(others).slice(0, count - 1);
  return shuffle([correct, ...distractors]);
}

function generateDistractorCapitals(correct: string, count: number): string[] {
  const allCapitals = ALL_STATES.map((s) => s.capital).filter((c) => c !== correct);
  const distractors = shuffle(allCapitals).slice(0, count - 1);
  return shuffle([correct, ...distractors]);
}

function generateDistractorStates(correct: string, count: number): string[] {
  const allNames = ALL_STATES.map((s) => s.name).filter((n) => n !== correct);
  const distractors = shuffle(allNames).slice(0, count - 1);
  return shuffle([correct, ...distractors]);
}

export function generateEasyQuestions(count: number): RegionQuestion[] {
  const questions: RegionQuestion[] = [];
  const generators = [
    // Region by description
    () => {
      const region = pickRandom(REGIONS);
      const char = pickRandom(region.characteristics);
      return {
        question: `Qual regiao tem esta caracteristica: "${char}"?`,
        options: generateDistractorRegions(region.name, 4),
        correct: region.name,
      };
    },
    // Region by color/emoji
    () => {
      const region = pickRandom(REGIONS);
      return {
        question: `A regiao representada pelo emoji ${region.emoji} e qual?`,
        options: generateDistractorRegions(region.name, 4),
        correct: region.name,
      };
    },
    // Which region is the state in
    () => {
      const state = pickRandom(ALL_STATES);
      return {
        question: `Em qual regiao fica o estado ${state.name}?`,
        options: generateDistractorRegions(state.region, 4),
        correct: state.region,
      };
    },
    // Biggest/smallest region
    () => {
      return {
        question: 'Qual e a maior regiao do Brasil em area?',
        options: generateDistractorRegions('Norte', 4),
        correct: 'Norte',
      };
    },
    () => {
      return {
        question: 'Qual regiao tem o menor numero de estados?',
        options: generateDistractorRegions('Sul', 4),
        correct: 'Sul',
      };
    },
    () => {
      return {
        question: 'Qual regiao abriga a Floresta Amazonica?',
        options: generateDistractorRegions('Norte', 4),
        correct: 'Norte',
      };
    },
    () => {
      return {
        question: 'Qual regiao e a mais populosa do Brasil?',
        options: generateDistractorRegions('Sudeste', 4),
        correct: 'Sudeste',
      };
    },
    () => {
      return {
        question: 'Em qual regiao fica a capital do Brasil?',
        options: generateDistractorRegions('Centro-Oeste', 4),
        correct: 'Centro-Oeste',
      };
    },
    () => {
      return {
        question: 'Qual regiao tem mais estados?',
        options: generateDistractorRegions('Nordeste', 4),
        correct: 'Nordeste',
      };
    },
    () => {
      return {
        question: 'Qual regiao possui o Pantanal?',
        options: generateDistractorRegions('Centro-Oeste', 4),
        correct: 'Centro-Oeste',
      };
    },
  ];

  const usedIndices = new Set<number>();
  while (questions.length < count) {
    let idx: number;
    if (usedIndices.size < generators.length) {
      do {
        idx = Math.floor(Math.random() * generators.length);
      } while (usedIndices.has(idx));
      usedIndices.add(idx);
    } else {
      idx = Math.floor(Math.random() * generators.length);
    }
    questions.push(generators[idx]());
  }

  return shuffle(questions);
}

export function generateMediumQuestions(count: number): RegionQuestion[] {
  const questions: RegionQuestion[] = [];
  const generators = [
    // State to region
    () => {
      const state = pickRandom(ALL_STATES);
      return {
        question: `O estado ${state.name} pertence a qual regiao?`,
        options: generateDistractorRegions(state.region, 4),
        correct: state.region,
      };
    },
    // Capital identification
    () => {
      const state = pickRandom(ALL_STATES);
      return {
        question: `Qual e a capital do estado ${state.name}?`,
        options: generateDistractorCapitals(state.capital, 4),
        correct: state.capital,
      };
    },
    // State by capital
    () => {
      const state = pickRandom(ALL_STATES);
      return {
        question: `${state.capital} e a capital de qual estado?`,
        options: generateDistractorStates(state.name, 4),
        correct: state.name,
      };
    },
    // Region characteristic
    () => {
      const region = pickRandom(REGIONS);
      const char = pickRandom(region.characteristics);
      const wrongRegion = pickRandomExcluding(REGIONS, region);
      const wrongChar = pickRandom(wrongRegion.characteristics);
      return {
        question: `Qual dessas caracteristicas pertence a regiao ${region.name}?`,
        options: shuffle([char, wrongChar, pickRandom(pickRandomExcluding(REGIONS, region).characteristics), pickRandom(pickRandomExcluding(REGIONS, wrongRegion).characteristics)].slice(0, 4)),
        correct: char,
      };
    },
    // Abbreviation to state
    () => {
      const state = pickRandom(ALL_STATES);
      return {
        question: `A sigla "${state.abbreviation}" corresponde a qual estado?`,
        options: generateDistractorStates(state.name, 4),
        correct: state.name,
      };
    },
    // Which state is NOT in this region
    () => {
      const region = pickRandom(REGIONS);
      const otherRegions = REGIONS.filter((r) => r.name !== region.name);
      const wrongState = pickRandom(pickRandom(otherRegions).states);
      const rightStates = shuffle(region.states).slice(0, 3);
      return {
        question: `Qual desses estados NAO pertence a regiao ${region.name}?`,
        options: shuffle([wrongState.name, ...rightStates.map((s) => s.name)]),
        correct: wrongState.name,
      };
    },
  ];

  const usedIndices = new Set<number>();
  while (questions.length < count) {
    let idx: number;
    if (usedIndices.size < generators.length) {
      do {
        idx = Math.floor(Math.random() * generators.length);
      } while (usedIndices.has(idx));
      usedIndices.add(idx);
    } else {
      idx = Math.floor(Math.random() * generators.length);
    }
    questions.push(generators[idx]());
  }

  return shuffle(questions);
}

export function generateHardQuestions(count: number): RegionQuestion[] {
  const questions: RegionQuestion[] = [];
  const regionStateCounts: Record<Region, number> = {
    Norte: 7,
    Nordeste: 9,
    'Centro-Oeste': 4,
    Sudeste: 4,
    Sul: 3,
  };

  const generators = [
    // Capital of harder states
    () => {
      const hardStates = ALL_STATES.filter((s) =>
        ['Tocantins', 'Amapa', 'Roraima', 'Sergipe', 'Piaui', 'Espirito Santo', 'Rondonia'].includes(s.name)
      );
      const state = pickRandom(hardStates);
      return {
        question: `Qual e a capital de ${state.name}?`,
        options: generateDistractorCapitals(state.capital, 4),
        correct: state.capital,
      };
    },
    // How many states in a region
    () => {
      const region = pickRandom(REGIONS);
      const correctCount = String(regionStateCounts[region.name]);
      const allCounts = ['3', '4', '7', '9'];
      const distractors = allCounts.filter((c) => c !== correctCount);
      return {
        question: `Quantos estados tem a regiao ${region.name}?`,
        options: shuffle([correctCount, ...shuffle(distractors).slice(0, 3)]),
        correct: correctCount,
      };
    },
    // Reverse capital to state (harder)
    () => {
      const hardStates = ALL_STATES.filter((s) =>
        ['Palmas', 'Boa Vista', 'Macapa', 'Rio Branco', 'Aracaju', 'Teresina', 'Florianopolis'].includes(s.capital)
      );
      const state = pickRandom(hardStates);
      return {
        question: `A cidade de ${state.capital} e capital de qual estado?`,
        options: generateDistractorStates(state.name, 4),
        correct: state.name,
      };
    },
    // Region characteristics deep
    () => {
      const region = pickRandom(REGIONS);
      const char = pickRandom(region.characteristics);
      return {
        question: `"${char}" - Esta frase descreve qual regiao?`,
        options: generateDistractorRegions(region.name, 4),
        correct: region.name,
      };
    },
    // State abbreviation for harder states
    () => {
      const hardStates = ALL_STATES.filter((s) =>
        ['TO', 'AP', 'RR', 'SE', 'PI', 'MS', 'ES'].includes(s.abbreviation)
      );
      const state = pickRandom(hardStates);
      return {
        question: `Qual e a sigla do estado ${state.name}?`,
        options: shuffle([state.abbreviation, ...shuffle(ALL_STATES.filter((s) => s.abbreviation !== state.abbreviation).map((s) => s.abbreviation)).slice(0, 3)]),
        correct: state.abbreviation,
      };
    },
    // Which capital is in this region
    () => {
      const region = pickRandom(REGIONS);
      const state = pickRandom(region.states);
      const otherCapitals = ALL_STATES
        .filter((s) => s.region !== region.name)
        .map((s) => s.capital);
      const distractors = shuffle(otherCapitals).slice(0, 3);
      return {
        question: `Qual dessas capitais fica na regiao ${region.name}?`,
        options: shuffle([state.capital, ...distractors]),
        correct: state.capital,
      };
    },
    // True/false style
    () => {
      return {
        question: 'Qual e a capital mais jovem do Brasil, planejada e inaugurada em 1989?',
        options: shuffle(['Palmas', 'Brasilia', 'Goiania', 'Belo Horizonte']),
        correct: 'Palmas',
      };
    },
    () => {
      return {
        question: 'Qual estado brasileiro tem nome composto com "do Sul"?',
        options: shuffle(['Mato Grosso do Sul', 'Rio de Janeiro', 'Espirito Santo', 'Santa Catarina']),
        correct: 'Mato Grosso do Sul',
      };
    },
  ];

  const usedIndices = new Set<number>();
  while (questions.length < count) {
    let idx: number;
    if (usedIndices.size < generators.length) {
      do {
        idx = Math.floor(Math.random() * generators.length);
      } while (usedIndices.has(idx));
      usedIndices.add(idx);
    } else {
      idx = Math.floor(Math.random() * generators.length);
    }
    questions.push(generators[idx]());
  }

  return shuffle(questions);
}

export function generateQuestions(difficulty: 'easy' | 'medium' | 'hard', count: number): RegionQuestion[] {
  switch (difficulty) {
    case 'easy':
      return generateEasyQuestions(count);
    case 'medium':
      return generateMediumQuestions(count);
    case 'hard':
      return generateHardQuestions(count);
  }
}
