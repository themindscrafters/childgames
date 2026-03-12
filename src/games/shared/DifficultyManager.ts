import type { Difficulty } from '../../data/models';

export interface DifficultyConfig {
  level: Difficulty;
  label: string;
  itemCount: number;
  optionCount: number;
  timeLimit: number; // 0 = no limit
  hintsAvailable: boolean;
  autoAdvance: boolean;
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    level: 'easy',
    label: 'Facil',
    itemCount: 3,
    optionCount: 2,
    timeLimit: 0,
    hintsAvailable: true,
    autoAdvance: false,
  },
  medium: {
    level: 'medium',
    label: 'Medio',
    itemCount: 5,
    optionCount: 3,
    timeLimit: 0,
    hintsAvailable: true,
    autoAdvance: false,
  },
  hard: {
    level: 'hard',
    label: 'Dificil',
    itemCount: 7,
    optionCount: 4,
    timeLimit: 0,
    hintsAvailable: false,
    autoAdvance: true,
  },
};

export class DifficultyManager {
  private currentDifficulty: Difficulty;
  private consecutiveCorrect = 0;
  private consecutiveWrong = 0;

  constructor(initial: Difficulty = 'easy') {
    this.currentDifficulty = initial;
  }

  getConfig(): DifficultyConfig {
    return DIFFICULTY_CONFIGS[this.currentDifficulty];
  }

  getDifficulty(): Difficulty {
    return this.currentDifficulty;
  }

  setDifficulty(d: Difficulty) {
    this.currentDifficulty = d;
    this.consecutiveCorrect = 0;
    this.consecutiveWrong = 0;
  }

  recordAnswer(correct: boolean): { changed: boolean; newDifficulty: Difficulty } {
    if (correct) {
      this.consecutiveCorrect++;
      this.consecutiveWrong = 0;
    } else {
      this.consecutiveWrong++;
      this.consecutiveCorrect = 0;
    }

    const prev = this.currentDifficulty;

    if (this.consecutiveCorrect >= 5 && this.currentDifficulty !== 'hard') {
      this.currentDifficulty = this.currentDifficulty === 'easy' ? 'medium' : 'hard';
      this.consecutiveCorrect = 0;
    } else if (this.consecutiveWrong >= 3 && this.currentDifficulty !== 'easy') {
      this.currentDifficulty = this.currentDifficulty === 'hard' ? 'medium' : 'easy';
      this.consecutiveWrong = 0;
    }

    return {
      changed: prev !== this.currentDifficulty,
      newDifficulty: this.currentDifficulty,
    };
  }

  reset() {
    this.consecutiveCorrect = 0;
    this.consecutiveWrong = 0;
  }
}
