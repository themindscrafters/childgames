export interface RewardState {
  stars: number;
  stickers: string[];
  streak: number;
  bestStreak: number;
  totalCorrect: number;
  message: string;
}

const ENCOURAGEMENT_MESSAGES = [
  'Muito bem!',
  'Parabens!',
  'Voce conseguiu!',
  'Incrivel!',
  'Excelente!',
  'Arrasou!',
  'Mandou bem!',
  'Fantastico!',
  'Genial!',
  'Brilhante!',
];

const TRY_AGAIN_MESSAGES = [
  'Tente de novo!',
  'Voce consegue!',
  'Quase la!',
  'Continue tentando!',
  'Nao desista!',
  'Vamos tentar mais uma vez!',
];

const STICKER_COLLECTION = [
  '\u2B50', '\uD83C\uDF1F', '\uD83C\uDF08', '\uD83E\uDD8B', '\uD83C\uDF3B',
  '\uD83D\uDE80', '\uD83C\uDF1E', '\uD83D\uDC1D', '\uD83C\uDF40', '\uD83C\uDF53',
  '\uD83D\uDC20', '\uD83E\uDD84', '\uD83C\uDF89', '\uD83C\uDF38', '\uD83D\uDC8E',
  '\uD83E\uDDE9', '\uD83C\uDFC6', '\uD83C\uDF6D', '\uD83D\uDC51', '\uD83C\uDFA8',
];

export class RewardSystem {
  private state: RewardState = {
    stars: 0,
    stickers: [],
    streak: 0,
    bestStreak: 0,
    totalCorrect: 0,
    message: '',
  };

  getState(): RewardState {
    return { ...this.state };
  }

  recordCorrect(): RewardState {
    this.state.streak++;
    this.state.totalCorrect++;
    this.state.stars++;

    if (this.state.streak > this.state.bestStreak) {
      this.state.bestStreak = this.state.streak;
    }

    // Award sticker every 3 correct answers
    if (this.state.totalCorrect % 3 === 0) {
      const availableStickers = STICKER_COLLECTION.filter(
        (s) => !this.state.stickers.includes(s)
      );
      if (availableStickers.length > 0) {
        const sticker = availableStickers[Math.floor(Math.random() * availableStickers.length)];
        this.state.stickers.push(sticker);
      }
    }

    this.state.message = ENCOURAGEMENT_MESSAGES[
      Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
    ];

    return this.getState();
  }

  recordWrong(): RewardState {
    this.state.streak = 0;
    this.state.message = TRY_AGAIN_MESSAGES[
      Math.floor(Math.random() * TRY_AGAIN_MESSAGES.length)
    ];
    return this.getState();
  }

  reset(): void {
    this.state = {
      stars: 0,
      stickers: [],
      streak: 0,
      bestStreak: 0,
      totalCorrect: 0,
      message: '',
    };
  }
}
