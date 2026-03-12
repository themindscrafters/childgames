export type Difficulty = 'easy' | 'medium' | 'hard';

export type LearningDifficulty = 'dyslexia' | 'dyscalculia' | 'adhd' | 'autism' | 'dyspraxia' | 'none';

export type GameCategory = 'literacy' | 'math' | 'memory' | 'motor' | 'social' | 'portugues' | 'matematica' | 'ciencias' | 'geografia-historia';

export type GradeLevel = 'early' | '5ano';

export interface Student {
  id?: number;
  name: string;
  avatar: string;
  difficulties: LearningDifficulty[];
  currentDifficulty: Difficulty;
  createdAt: Date;
  settings: StudentSettings;
}

export interface StudentSettings {
  font: 'default' | 'lexend' | 'opendyslexic';
  highContrast: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  narrationEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  enabledGames: string[];
}

export interface GameSession {
  id?: number;
  studentId: number;
  gameId: string;
  startedAt: Date;
  endedAt?: Date;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  attempts: number;
  hintsUsed: number;
  completed: boolean;
}

export interface GameInfo {
  id: string;
  name: string;
  description: string;
  category: GameCategory;
  icon: string;
  color: string;
  targetDifficulties: LearningDifficulty[];
  gradeLevel: GradeLevel;
}

export const GAME_LIST: GameInfo[] = [
  {
    id: 'letter-match',
    name: 'Letra e Som',
    description: 'Associe a letra ao seu som',
    category: 'literacy',
    icon: 'Aa',
    color: '#4F46E5',
    targetDifficulties: ['dyslexia'],
    gradeLevel: 'early',
  },
  {
    id: 'syllable-puzzle',
    name: 'Quebra-Silabas',
    description: 'Monte palavras com silabas',
    category: 'literacy',
    icon: 'BA',
    color: '#7C3AED',
    targetDifficulties: ['dyslexia'],
    gradeLevel: 'early',
  },
  {
    id: 'word-builder',
    name: 'Construtor de Palavras',
    description: 'Forme palavras com as letras',
    category: 'literacy',
    icon: 'ABC',
    color: '#6366F1',
    targetDifficulties: ['dyslexia'],
    gradeLevel: 'early',
  },
  {
    id: 'number-sense',
    name: 'Senso Numerico',
    description: 'Aprenda sobre quantidades',
    category: 'math',
    icon: '123',
    color: '#10B981',
    targetDifficulties: ['dyscalculia'],
    gradeLevel: 'early',
  },
  {
    id: 'counting-adventure',
    name: 'Aventura de Contagem',
    description: 'Conte os objetos e divirta-se',
    category: 'math',
    icon: '#',
    color: '#059669',
    targetDifficulties: ['dyscalculia', 'adhd'],
    gradeLevel: 'early',
  },
  {
    id: 'shape-explorer',
    name: 'Explorador de Formas',
    description: 'Descubra as formas geometricas',
    category: 'math',
    icon: '[]',
    color: '#14B8A6',
    targetDifficulties: ['dyscalculia', 'dyspraxia'],
    gradeLevel: 'early',
  },
  {
    id: 'memory-cards',
    name: 'Jogo da Memoria',
    description: 'Encontre os pares iguais',
    category: 'memory',
    icon: '??',
    color: '#F59E0B',
    targetDifficulties: ['adhd', 'autism'],
    gradeLevel: 'early',
  },
  {
    id: 'sequence-game',
    name: 'Sequencia Magica',
    description: 'Repita a sequencia de cores',
    category: 'memory',
    icon: '>>',
    color: '#D97706',
    targetDifficulties: ['adhd'],
    gradeLevel: 'early',
  },
  {
    id: 'path-tracer',
    name: 'Tracar Caminhos',
    description: 'Siga o caminho com o dedo',
    category: 'motor',
    icon: '~',
    color: '#EC4899',
    targetDifficulties: ['dyspraxia'],
    gradeLevel: 'early',
  },
  {
    id: 'emotion-match',
    name: 'Mundo das Emocoes',
    description: 'Aprenda sobre sentimentos',
    category: 'social',
    icon: ':)',
    color: '#F472B6',
    targetDifficulties: ['autism'],
    gradeLevel: 'early',
  },
  // === 5º Ano - Fundamental I ===
  {
    id: 'fraction-lab',
    name: 'Laboratório de Frações',
    description: 'Aprenda frações com visuais divertidos',
    category: 'matematica',
    icon: '🍕',
    color: '#059669',
    targetDifficulties: ['dyscalculia'],
    gradeLevel: '5ano',
  },
  {
    id: 'math-operations',
    name: 'Operações Avançadas',
    description: 'Multiplicação e divisão desafiadoras',
    category: 'matematica',
    icon: '✖️',
    color: '#10B981',
    targetDifficulties: ['dyscalculia'],
    gradeLevel: '5ano',
  },
  {
    id: 'decimal-world',
    name: 'Mundo dos Decimais',
    description: 'Explore números decimais e porcentagens',
    category: 'matematica',
    icon: '💰',
    color: '#14B8A6',
    targetDifficulties: ['dyscalculia'],
    gradeLevel: '5ano',
  },
  {
    id: 'word-classes',
    name: 'Classes de Palavras',
    description: 'Identifique substantivos, verbos e mais',
    category: 'portugues',
    icon: '📝',
    color: '#6366F1',
    targetDifficulties: ['dyslexia'],
    gradeLevel: '5ano',
  },
  {
    id: 'spelling-challenge',
    name: 'Desafio Ortográfico',
    description: 'Teste sua ortografia avançada',
    category: 'portugues',
    icon: '✏️',
    color: '#7C3AED',
    targetDifficulties: ['dyslexia'],
    gradeLevel: '5ano',
  },
  {
    id: 'text-comprehension',
    name: 'Compreensão de Texto',
    description: 'Leia e interprete textos',
    category: 'portugues',
    icon: '📖',
    color: '#4F46E5',
    targetDifficulties: ['dyslexia', 'adhd'],
    gradeLevel: '5ano',
  },
  {
    id: 'solar-system',
    name: 'Sistema Solar',
    description: 'Explore os planetas e o espaço',
    category: 'ciencias',
    icon: '🪐',
    color: '#F59E0B',
    targetDifficulties: ['none'],
    gradeLevel: '5ano',
  },
  {
    id: 'human-body',
    name: 'Corpo Humano',
    description: 'Conheça os órgãos e sistemas do corpo',
    category: 'ciencias',
    icon: '🫀',
    color: '#EF4444',
    targetDifficulties: ['none'],
    gradeLevel: '5ano',
  },
  {
    id: 'brazil-regions',
    name: 'Regiões do Brasil',
    description: 'Descubra estados, capitais e regiões',
    category: 'geografia-historia',
    icon: '🗺️',
    color: '#06B6D4',
    targetDifficulties: ['none'],
    gradeLevel: '5ano',
  },
  {
    id: 'history-timeline',
    name: 'Linha do Tempo',
    description: 'Viaje pela história do Brasil',
    category: 'geografia-historia',
    icon: '⏳',
    color: '#D97706',
    targetDifficulties: ['none'],
    gradeLevel: '5ano',
  },
];

export const DEFAULT_STUDENT_SETTINGS: StudentSettings = {
  font: 'lexend',
  highContrast: false,
  soundEnabled: true,
  musicEnabled: true,
  narrationEnabled: true,
  animationSpeed: 'normal',
  enabledGames: GAME_LIST.map((g) => g.id),
};

export const AVATARS = [
  { id: 'cat', emoji: '\uD83D\uDC31', label: 'Gatinho' },
  { id: 'dog', emoji: '\uD83D\uDC36', label: 'Cachorrinho' },
  { id: 'rabbit', emoji: '\uD83D\uDC30', label: 'Coelhinho' },
  { id: 'bear', emoji: '\uD83D\uDC3B', label: 'Ursinho' },
  { id: 'star', emoji: '\u2B50', label: 'Estrela' },
  { id: 'sun', emoji: '\u2600\uFE0F', label: 'Sol' },
  { id: 'rainbow', emoji: '\uD83C\uDF08', label: 'Arco-iris' },
  { id: 'butterfly', emoji: '\uD83E\uDD8B', label: 'Borboleta' },
];
