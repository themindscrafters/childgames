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

// ── FÁCIL ──────────────────────────────────────────────────────────────
// Temas: regiões, estados, biomas, rios, características geográficas
export function generateEasyQuestions(count: number): RegionQuestion[] {
  const questions: RegionQuestion[] = [];
  const generators = [
    // --- Regiões e características ---
    () => {
      const region = pickRandom(REGIONS);
      const char = pickRandom(region.characteristics);
      return { question: `Qual regiao tem esta caracteristica: "${char}"?`, options: generateDistractorRegions(region.name, 4), correct: region.name };
    },
    () => {
      const region = pickRandom(REGIONS);
      const state = pickRandom(region.states);
      return { question: `A capital ${state.capital} fica em qual regiao do Brasil?`, options: generateDistractorRegions(region.name, 4), correct: region.name };
    },
    () => {
      const state = pickRandom(ALL_STATES);
      return { question: `Em qual regiao fica o estado ${state.name}?`, options: generateDistractorRegions(state.region, 4), correct: state.region };
    },
    () => ({ question: 'Qual e a maior regiao do Brasil em area?', options: generateDistractorRegions('Norte', 4), correct: 'Norte' }),
    () => ({ question: 'Qual regiao abriga a Floresta Amazonica?', options: generateDistractorRegions('Norte', 4), correct: 'Norte' }),
    () => ({ question: 'Qual regiao e a mais populosa do Brasil?', options: generateDistractorRegions('Sudeste', 4), correct: 'Sudeste' }),
    () => ({ question: 'Em qual regiao fica a capital do Brasil?', options: generateDistractorRegions('Centro-Oeste', 4), correct: 'Centro-Oeste' }),
    () => ({ question: 'Qual regiao possui o Pantanal?', options: generateDistractorRegions('Centro-Oeste', 4), correct: 'Centro-Oeste' }),

    // --- Biomas ---
    () => ({ question: 'Qual e o maior bioma do Brasil?', options: shuffle(['Amazonia', 'Cerrado', 'Caatinga', 'Mata Atlantica']), correct: 'Amazonia' }),
    () => ({ question: 'Em qual bioma encontramos cactos e plantas que guardam agua?', options: shuffle(['Caatinga', 'Amazonia', 'Pantanal', 'Pampa']), correct: 'Caatinga' }),
    () => ({ question: 'Qual bioma e conhecido como a "savana brasileira"?', options: shuffle(['Cerrado', 'Amazonia', 'Pampa', 'Caatinga']), correct: 'Cerrado' }),
    () => ({ question: 'Qual bioma fica principalmente na costa leste do Brasil?', options: shuffle(['Mata Atlantica', 'Amazonia', 'Cerrado', 'Pantanal']), correct: 'Mata Atlantica' }),
    () => ({ question: 'Qual bioma e a maior planicie alagavel do mundo?', options: shuffle(['Pantanal', 'Amazonia', 'Cerrado', 'Pampa']), correct: 'Pantanal' }),
    () => ({ question: 'O Pampa e um bioma de campos encontrado em qual regiao?', options: generateDistractorRegions('Sul', 4), correct: 'Sul' }),
    () => ({ question: 'Quantos biomas principais o Brasil possui?', options: shuffle(['6', '3', '10', '2']), correct: '6' }),

    // --- Rios ---
    () => ({ question: 'Qual e o maior rio do Brasil em volume de agua?', options: shuffle(['Rio Amazonas', 'Rio Sao Francisco', 'Rio Parana', 'Rio Tocantins']), correct: 'Rio Amazonas' }),
    () => ({ question: 'O Rio Sao Francisco e conhecido como o "rio da..."', options: shuffle(['Integracao nacional', 'Saudade', 'Esperanca', 'Aventura']), correct: 'Integracao nacional' }),
    () => ({ question: 'Em qual regiao fica o Rio Amazonas?', options: generateDistractorRegions('Norte', 4), correct: 'Norte' }),

    // --- Clima ---
    () => ({ question: 'Qual regiao do Brasil tem o clima mais frio?', options: generateDistractorRegions('Sul', 4), correct: 'Sul' }),
    () => ({ question: 'O sertao nordestino tem qual tipo de clima?', options: shuffle(['Semiarido (seco)', 'Equatorial (umido)', 'Subtropical (frio)', 'Polar']), correct: 'Semiarido (seco)' }),
  ];

  const usedIndices = new Set<number>();
  while (questions.length < count) {
    let idx: number;
    if (usedIndices.size < generators.length) {
      do { idx = Math.floor(Math.random() * generators.length); } while (usedIndices.has(idx));
      usedIndices.add(idx);
    } else {
      idx = Math.floor(Math.random() * generators.length);
    }
    questions.push(generators[idx]());
  }
  return shuffle(questions);
}

// ── MÉDIO ──────────────────────────────────────────────────────────────
// Temas: estados/capitais, biomas aprofundados, população, economia, cidade/campo, transportes
export function generateMediumQuestions(count: number): RegionQuestion[] {
  const questions: RegionQuestion[] = [];
  const generators = [
    // --- Estados e capitais ---
    () => {
      const state = pickRandom(ALL_STATES);
      return { question: `O estado ${state.name} pertence a qual regiao?`, options: generateDistractorRegions(state.region, 4), correct: state.region };
    },
    () => {
      const state = pickRandom(ALL_STATES);
      return { question: `Qual e a capital do estado ${state.name}?`, options: generateDistractorCapitals(state.capital, 4), correct: state.capital };
    },
    () => {
      const state = pickRandom(ALL_STATES);
      return { question: `${state.capital} e a capital de qual estado?`, options: generateDistractorStates(state.name, 4), correct: state.name };
    },
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
    () => {
      const state = pickRandom(ALL_STATES);
      return { question: `A sigla "${state.abbreviation}" corresponde a qual estado?`, options: generateDistractorStates(state.name, 4), correct: state.name };
    },
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

    // --- Biomas aprofundados ---
    () => ({ question: 'Qual bioma brasileiro e o mais desmatado?', options: shuffle(['Mata Atlantica', 'Amazonia', 'Cerrado', 'Pantanal']), correct: 'Mata Atlantica' }),
    () => ({ question: 'A Caatinga e um bioma exclusivo de qual pais?', options: shuffle(['Brasil', 'Argentina', 'Colombia', 'Paraguai']), correct: 'Brasil' }),
    () => ({ question: 'Qual bioma e fundamental para a producao de agua no Brasil?', options: shuffle(['Cerrado', 'Pampa', 'Pantanal', 'Caatinga']), correct: 'Cerrado' }),
    () => ({ question: 'A onca-pintada vive principalmente em quais biomas?', options: shuffle(['Amazonia e Pantanal', 'Pampa e Caatinga', 'Mata Atlantica e Cerrado', 'Caatinga e Pampa']), correct: 'Amazonia e Pantanal' }),
    () => ({ question: 'Qual bioma tem arvores retorcidas e troncos grossos?', options: shuffle(['Cerrado', 'Amazonia', 'Pantanal', 'Mata Atlantica']), correct: 'Cerrado' }),
    () => ({ question: 'A araucaria (pinheiro-do-parana) e tipica de qual bioma/regiao?', options: shuffle(['Mata Atlantica do Sul', 'Amazonia', 'Caatinga', 'Cerrado']), correct: 'Mata Atlantica do Sul' }),

    // --- População e migração ---
    () => ({ question: 'Qual e a cidade mais populosa do Brasil?', options: shuffle(['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador']), correct: 'Sao Paulo' }),
    () => ({ question: 'A maioria da populacao brasileira vive em areas...', options: shuffle(['Urbanas (cidades)', 'Rurais (campo)', 'Florestais', 'Litoraneas']), correct: 'Urbanas (cidades)' }),
    () => ({ question: 'A migracao de nordestinos para o Sudeste aconteceu principalmente em busca de...', options: shuffle(['Emprego e melhores condicoes de vida', 'Praias mais bonitas', 'Clima mais quente', 'Terras para plantar']), correct: 'Emprego e melhores condicoes de vida' }),
    () => ({ question: 'O exodo rural e quando as pessoas saem do...', options: shuffle(['Campo para a cidade', 'Cidade para o campo', 'Brasil para outro pais', 'Litoral para o interior']), correct: 'Campo para a cidade' }),

    // --- Economia ---
    () => ({ question: 'Qual regiao e a maior produtora de soja do Brasil?', options: generateDistractorRegions('Centro-Oeste', 4), correct: 'Centro-Oeste' }),
    () => ({ question: 'O que e agropecuaria?', options: shuffle(['Agricultura e criacao de animais juntas', 'Apenas plantar', 'Apenas criar animais', 'Industria de alimentos']), correct: 'Agricultura e criacao de animais juntas' }),
    () => ({ question: 'Qual regiao concentra a maior parte das industrias do Brasil?', options: generateDistractorRegions('Sudeste', 4), correct: 'Sudeste' }),
    () => ({ question: 'O acai, fruto tipico da Amazonia, e produzido principalmente em qual regiao?', options: generateDistractorRegions('Norte', 4), correct: 'Norte' }),

    // --- Cidade e campo ---
    () => ({ question: 'Qual a diferenca entre zona urbana e zona rural?', options: shuffle(['Urbana e a cidade, rural e o campo', 'Sao a mesma coisa', 'Rural e a cidade, urbana e o campo', 'Urbana e a praia, rural e a montanha']), correct: 'Urbana e a cidade, rural e o campo' }),
    () => ({ question: 'O que o campo produz que chega ate as cidades?', options: shuffle(['Alimentos como arroz, feijao e leite', 'Carros e computadores', 'Roupas e sapatos', 'Livros e cadernos']), correct: 'Alimentos como arroz, feijao e leite' }),
  ];

  const usedIndices = new Set<number>();
  while (questions.length < count) {
    let idx: number;
    if (usedIndices.size < generators.length) {
      do { idx = Math.floor(Math.random() * generators.length); } while (usedIndices.has(idx));
      usedIndices.add(idx);
    } else {
      idx = Math.floor(Math.random() * generators.length);
    }
    questions.push(generators[idx]());
  }
  return shuffle(questions);
}

// ── DIFÍCIL ────────────────────────────────────────────────────────────
// Temas: capitais difíceis, siglas, biomas e desmatamento, meio ambiente, rios, relevo, energia, transporte
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
    // --- Capitais e siglas difíceis ---
    () => {
      const hardStates = ALL_STATES.filter((s) =>
        ['Tocantins', 'Amapa', 'Roraima', 'Sergipe', 'Piaui', 'Espirito Santo', 'Rondonia'].includes(s.name)
      );
      const state = pickRandom(hardStates);
      return { question: `Qual e a capital de ${state.name}?`, options: generateDistractorCapitals(state.capital, 4), correct: state.capital };
    },
    () => {
      const region = pickRandom(REGIONS);
      const correctCount = String(regionStateCounts[region.name]);
      const allCounts = ['3', '4', '7', '9'];
      const distractors = allCounts.filter((c) => c !== correctCount);
      return { question: `Quantos estados tem a regiao ${region.name}?`, options: shuffle([correctCount, ...shuffle(distractors).slice(0, 3)]), correct: correctCount };
    },
    () => {
      const hardStates = ALL_STATES.filter((s) =>
        ['Palmas', 'Boa Vista', 'Macapa', 'Rio Branco', 'Aracaju', 'Teresina', 'Florianopolis'].includes(s.capital)
      );
      const state = pickRandom(hardStates);
      return { question: `A cidade de ${state.capital} e capital de qual estado?`, options: generateDistractorStates(state.name, 4), correct: state.name };
    },
    () => {
      const region = pickRandom(REGIONS);
      const char = pickRandom(region.characteristics);
      return { question: `"${char}" - Esta frase descreve qual regiao?`, options: generateDistractorRegions(region.name, 4), correct: region.name };
    },
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
    () => {
      const region = pickRandom(REGIONS);
      const state = pickRandom(region.states);
      const otherCapitals = ALL_STATES.filter((s) => s.region !== region.name).map((s) => s.capital);
      const distractors = shuffle(otherCapitals).slice(0, 3);
      return { question: `Qual dessas capitais fica na regiao ${region.name}?`, options: shuffle([state.capital, ...distractors]), correct: state.capital };
    },
    () => ({ question: 'Qual e a capital mais jovem do Brasil, planejada e inaugurada em 1989?', options: shuffle(['Palmas', 'Brasilia', 'Goiania', 'Belo Horizonte']), correct: 'Palmas' }),
    () => ({ question: 'Qual estado brasileiro tem nome composto com "do Sul"?', options: shuffle(['Mato Grosso do Sul', 'Rio de Janeiro', 'Espirito Santo', 'Santa Catarina']), correct: 'Mato Grosso do Sul' }),

    // --- Biomas e meio ambiente ---
    () => ({ question: 'O desmatamento da Amazonia contribui para...', options: shuffle(['Aquecimento global e perda de biodiversidade', 'Mais chuva na regiao', 'Crescimento da floresta', 'Melhoria do clima']), correct: 'Aquecimento global e perda de biodiversidade' }),
    () => ({ question: 'A Mata Atlantica original cobria quanto do territorio brasileiro?', options: shuffle(['Quase toda a costa leste', 'Apenas o Sul', 'Apenas o Norte', 'O centro do pais']), correct: 'Quase toda a costa leste' }),
    () => ({ question: 'Hoje, resta aproximadamente quanto da Mata Atlantica original?', options: shuffle(['Menos de 15%', 'Mais de 80%', 'Cerca de 50%', 'Quase 100%']), correct: 'Menos de 15%' }),
    () => ({ question: 'O Cerrado e importante porque...', options: shuffle(['E o berco de muitos rios e nascentes do Brasil', 'E o bioma mais frio', 'Tem as maiores cidades', 'Nao tem importancia ambiental']), correct: 'E o berco de muitos rios e nascentes do Brasil' }),
    () => ({ question: 'A queimada no Pantanal prejudica principalmente...', options: shuffle(['A fauna e a flora locais', 'Apenas as cidades', 'Outros paises', 'O fundo do oceano']), correct: 'A fauna e a flora locais' }),
    () => ({ question: 'A poluicao dos rios e causada principalmente por...', options: shuffle(['Esgoto, lixo e produtos quimicos', 'Chuva e vento', 'Animais selvagens', 'Terremotos']), correct: 'Esgoto, lixo e produtos quimicos' }),

    // --- Rios aprofundados ---
    () => ({ question: 'O Rio Sao Francisco passa por quais regioes?', options: shuffle(['Sudeste e Nordeste', 'Norte e Sul', 'Centro-Oeste e Sul', 'Norte e Nordeste']), correct: 'Sudeste e Nordeste' }),
    () => ({ question: 'Qual rio forma as Cataratas do Iguacu?', options: shuffle(['Rio Iguacu', 'Rio Amazonas', 'Rio Sao Francisco', 'Rio Parana']), correct: 'Rio Iguacu' }),
    () => ({ question: 'A Bacia Amazonica e a maior bacia hidrografica do...', options: shuffle(['Mundo', 'Brasil apenas', 'Hemisferio sul', 'Continente americano']), correct: 'Mundo' }),

    // --- Relevo ---
    () => ({ question: 'A Planicie Amazonica e uma area de relevo...', options: shuffle(['Baixo e plano, sujeito a inundacoes', 'Muito montanhoso', 'Desértico', 'Vulcanico']), correct: 'Baixo e plano, sujeito a inundacoes' }),
    () => ({ question: 'A Serra da Mantiqueira fica em qual regiao?', options: generateDistractorRegions('Sudeste', 4), correct: 'Sudeste' }),

    // --- Energia e economia ---
    () => ({ question: 'A usina de Itaipu, uma das maiores do mundo, produz energia...', options: shuffle(['Hidreletrica (da agua)', 'Solar (do sol)', 'Eolica (do vento)', 'Nuclear']), correct: 'Hidreletrica (da agua)' }),
    () => ({ question: 'A regiao Nordeste se destaca na producao de energia...', options: shuffle(['Eolica (do vento) e solar', 'Nuclear', 'A carvao', 'A gas']), correct: 'Eolica (do vento) e solar' }),
    () => ({ question: 'O agronegocio brasileiro exporta principalmente...', options: shuffle(['Soja, carne e cafe', 'Carros e avioes', 'Roupas e sapatos', 'Computadores e celulares']), correct: 'Soja, carne e cafe' }),
    () => ({ question: 'Qual produto agricola o Brasil e o maior produtor mundial?', options: shuffle(['Cafe', 'Trigo', 'Arroz', 'Batata']), correct: 'Cafe' }),

    // --- Transporte e comunicação ---
    () => ({ question: 'Qual e o principal meio de transporte de cargas no Brasil?', options: shuffle(['Rodoviario (caminhoes)', 'Ferroviario (trens)', 'Fluvial (barcos)', 'Aereo (avioes)']), correct: 'Rodoviario (caminhoes)' }),
    () => ({ question: 'Na regiao Norte, o transporte fluvial (por rios) e importante porque...', options: shuffle(['Muitas comunidades so sao acessiveis por rio', 'Nao existem estradas', 'Os rios sao pequenos', 'E mais rapido que o aviao']), correct: 'Muitas comunidades so sao acessiveis por rio' }),

    // --- População e diversidade ---
    () => ({ question: 'A imigracao japonesa no Brasil se concentrou principalmente em...', options: shuffle(['Sao Paulo', 'Salvador', 'Manaus', 'Porto Alegre']), correct: 'Sao Paulo' }),
    () => ({ question: 'A imigracao italiana e alema influenciou fortemente a cultura de qual regiao?', options: generateDistractorRegions('Sul', 4), correct: 'Sul' }),
    () => ({ question: 'O que e uma metrópole?', options: shuffle(['Cidade muito grande que influencia a regiao ao redor', 'Qualquer cidade com praia', 'Uma cidade sem industrias', 'Uma cidade do campo']), correct: 'Cidade muito grande que influencia a regiao ao redor' }),
  ];

  const usedIndices = new Set<number>();
  while (questions.length < count) {
    let idx: number;
    if (usedIndices.size < generators.length) {
      do { idx = Math.floor(Math.random() * generators.length); } while (usedIndices.has(idx));
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
