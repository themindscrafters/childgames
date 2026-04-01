import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DifficultyManager } from '../../shared/DifficultyManager';
import { RewardSystem } from '../../shared/RewardSystem';
import { audioManager } from '../../shared/AudioManager';
import { saveSession } from '../../../data/db';
import { useApp } from '../../../hooks/useAppContext';
import { GameComplete } from '../../../components/GameSelector/GameComplete';

interface WordEntry {
  word: string;
  hint: string;
}

const EASY_WORDS: WordEntry[] = [
  { word: 'SOL', hint: '☀️' },
  { word: 'LUA', hint: '🌙' },
  { word: 'MAE', hint: '👩' },
  { word: 'PAI', hint: '👨' },
  { word: 'CHA', hint: '🍵' },
  { word: 'REI', hint: '👑' },
  { word: 'COR', hint: '🎨' },
  { word: 'PEZ', hint: '🐟' },
  { word: 'RUA', hint: '🛣️' },
  { word: 'CEU', hint: '🌤️' },
];

const MEDIUM_WORDS: WordEntry[] = [
  { word: 'GATO', hint: '🐱' },
  { word: 'BOLA', hint: '⚽' },
  { word: 'CASA', hint: '🏠' },
  { word: 'PATO', hint: '🦆' },
  { word: 'SAPO', hint: '🐸' },
  { word: 'LOBO', hint: '🐺' },
  { word: 'VACA', hint: '🐄' },
  { word: 'MALA', hint: '💼' },
  { word: 'FOGO', hint: '🔥' },
  { word: 'ROSA', hint: '🌹' },
  { word: 'RATO', hint: '🐭' },
  { word: 'BOLO', hint: '🎂' },
];

const HARD_WORDS: WordEntry[] = [
  { word: 'TIGRE', hint: '🐯' },
  { word: 'LEITE', hint: '🥛' },
  { word: 'NUVEM', hint: '☁️' },
  { word: 'PLUMA', hint: '🪶' },
  { word: 'BARCO', hint: '🚢' },
  { word: 'LIVRO', hint: '📖' },
  { word: 'FOLHA', hint: '🍃' },
  { word: 'PORTA', hint: '🚪' },
  { word: 'TREM', hint: '🚂' },
  { word: 'FLORE', hint: '🌸' },
  { word: 'MOUSE', hint: '🖱️' },
  { word: 'PEIXE', hint: '🐠' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getWordPool(difficulty: string): WordEntry[] {
  switch (difficulty) {
    case 'easy': return EASY_WORDS;
    case 'medium': return MEDIUM_WORDS;
    case 'hard': return HARD_WORDS;
    default: return EASY_WORDS;
  }
}

const LETTER_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#F97316', '#14B8A6', '#6366F1', '#D946EF',
];

const SLOT_BG_FILLED = '#4F46E5';

export function WordBuilderGame() {
  const { currentStudent } = useApp();
  const difficultyRef = useRef(
    new DifficultyManager(currentStudent?.current_difficulty ?? 'easy')
  );
  const rewardRef = useRef(new RewardSystem());

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [placedLetters, setPlacedLetters] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'complete' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [startedAt] = useState(new Date().toISOString());
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [hintIndex, setHintIndex] = useState<number | null>(null);

  const config = difficultyRef.current.getConfig();
  const totalRounds = config.itemCount;

  const wordList = useMemo(() => {
    const pool = getWordPool(difficultyRef.current.getDifficulty());
    return shuffle(pool).slice(0, totalRounds);
  }, [gameComplete]);

  const currentWord = wordList[round];

  const scrambledLetters = useMemo(() => {
    if (!currentWord) return [];
    return shuffle(currentWord.word.split(''));
  }, [currentWord]);

  const nextExpectedIndex = placedLetters.length;

  useEffect(() => {
    if (currentWord && !gameComplete) {
      const timer = setTimeout(() => {
        audioManager.speak(currentWord.word, 0.7);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [round, currentWord, gameComplete]);

  const handleTapLetter = useCallback(
    (letter: string, scrambledIdx: number) => {
      if (feedback === 'complete' || gameComplete || !currentWord) return;
      if (usedIndices.includes(scrambledIdx)) return;

      setAttempts((a) => a + 1);
      const expected = currentWord.word[nextExpectedIndex];

      if (letter === expected) {
        audioManager.playClick();
        const newPlaced = [...placedLetters, letter];
        const newUsed = [...usedIndices, scrambledIdx];
        setPlacedLetters(newPlaced);
        setUsedIndices(newUsed);

        if (newPlaced.length === currentWord.word.length) {
          // Word complete
          setFeedback('complete');
          audioManager.playCorrect();
          const reward = rewardRef.current.recordCorrect();
          difficultyRef.current.recordAnswer(true);
          setScore((s) => s + 1);
          setMessage(reward.message);

          audioManager.speak(`${currentWord.word}! ${reward.message}`, 0.8);

          setTimeout(() => {
            setFeedback(null);
            setPlacedLetters([]);
            setUsedIndices([]);
            setMessage('');
            if (round + 1 >= totalRounds) {
              finishGame();
            } else {
              setRound((r) => r + 1);
            }
          }, 1800);
        }
      } else {
        setFeedback('wrong');
        setShakeIndex(scrambledIdx);
        audioManager.playWrong();
        const reward = rewardRef.current.recordWrong();
        difficultyRef.current.recordAnswer(false);
        setMessage(reward.message);

        setTimeout(() => {
          setFeedback(null);
          setShakeIndex(null);
          setMessage('');
        }, 800);
      }
    },
    [feedback, gameComplete, currentWord, nextExpectedIndex, placedLetters, usedIndices, round, totalRounds]
  );

  const finishGame = useCallback(async () => {
    setGameComplete(true);
    if (currentStudent?.id) {
      await saveSession({
        student_id: currentStudent.id,
        game_id: 'word-builder',
        started_at: startedAt,
        ended_at: new Date().toISOString(),
        difficulty: difficultyRef.current.getDifficulty(),
        score,
        total_questions: totalRounds,
        correct_answers: score,
        attempts,
        hints_used: hintsUsed,
        completed: true,
      });
    }
  }, [currentStudent, startedAt, score, totalRounds, attempts, hintsUsed]);

  const handlePlayAgain = useCallback(() => {
    rewardRef.current.reset();
    difficultyRef.current.reset();
    setRound(0);
    setScore(0);
    setAttempts(0);
    setHintsUsed(0);
    setPlacedLetters([]);
    setUsedIndices([]);
    setFeedback(null);
    setMessage('');
    setGameComplete(false);
    setHintIndex(null);
  }, []);

  const handleHint = useCallback(() => {
    if (!config.hintsAvailable || !currentWord) return;
    setHintsUsed((h) => h + 1);
    const nextLetter = currentWord.word[nextExpectedIndex];
    // Find the index in scrambled that matches and is not used
    const idx = scrambledLetters.findIndex(
      (l, i) => l === nextLetter && !usedIndices.includes(i)
    );
    if (idx !== -1) {
      setHintIndex(idx);
      audioManager.playSelect();
      setTimeout(() => setHintIndex(null), 1000);
    }
  }, [config.hintsAvailable, currentWord, nextExpectedIndex, scrambledLetters, usedIndices]);

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardRef.current.getState()}
        gameName="Construtor de Palavras"
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (!currentWord) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 gap-3 select-none overflow-y-auto">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-bold text-yellow-500">{score}</span>
        </div>
        <div className="bg-white/80 rounded-full px-4 py-1 text-sm font-semibold text-gray-600">
          {round + 1} / {totalRounds}
        </div>
        <div className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
          {config.label}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${((round) / totalRounds) * 100}%` }}
        />
      </div>

      {/* Image hint */}
      <div className="flex flex-col items-center gap-2 mt-1">
        <p className="text-base text-gray-500 font-medium">
          Forme a palavra tocando nas letras!
        </p>
        <button
          onClick={() => audioManager.speak(currentWord.word, 0.7)}
          className="flex items-center gap-3"
        >
          <span className="text-7xl" style={{ animation: 'float 3s ease-in-out infinite' }}>
            {currentWord.hint}
          </span>
        </button>
        <span className="text-sm text-gray-400">Toque para ouvir</span>
      </div>

      {/* Letter slots */}
      <div className="flex items-center justify-center gap-2 flex-wrap my-2">
        {currentWord.word.split('').map((_letter, idx) => {
          const isFilled = idx < placedLetters.length;
          const isNext = idx === nextExpectedIndex;
          return (
            <div
              key={idx}
              className="flex items-center justify-center rounded-2xl transition-all duration-300"
              style={{
                minWidth: 64,
                minHeight: 72,
                fontSize: '2rem',
                fontWeight: 'bold',
                background: isFilled
                  ? SLOT_BG_FILLED
                  : isNext
                    ? '#E0E7FF'
                    : '#F3F4F6',
                color: isFilled ? '#fff' : '#C7D2FE',
                border: isNext && !isFilled
                  ? '3px dashed #6366F1'
                  : '3px solid transparent',
                borderRadius: 16,
                animation: isFilled ? 'popIn 0.3s ease-out' : 'none',
              }}
            >
              {isFilled ? placedLetters[idx] : '_'}
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      {message && (
        <div
          className={`text-xl font-bold px-6 py-2 rounded-2xl ${
            feedback === 'complete'
              ? 'bg-green-100 text-green-600'
              : feedback === 'wrong'
                ? 'bg-orange-100 text-orange-600'
                : 'bg-blue-100 text-blue-600'
          }`}
          style={{ animation: 'bounceIn 0.4s ease-out' }}
        >
          {message}
        </div>
      )}

      {/* Scrambled letters */}
      <div className="flex flex-wrap items-center justify-center gap-3 pb-2">
        {scrambledLetters.map((letter, idx) => {
          const isUsed = usedIndices.includes(idx);
          const isShaking = shakeIndex === idx;
          const isHinted = hintIndex === idx;
          const color = LETTER_COLORS[idx % LETTER_COLORS.length];

          if (isUsed) {
            return (
              <div
                key={idx}
                style={{
                  minWidth: 80,
                  minHeight: 80,
                  borderRadius: 20,
                  background: '#F3F4F6',
                  border: '3px dashed #D1D5DB',
                  opacity: 0.3,
                }}
              />
            );
          }

          return (
            <button
              key={idx}
              onClick={() => handleTapLetter(letter, idx)}
              disabled={feedback === 'complete'}
              className={`shadow-lg active:scale-95 transition-transform ${
                isShaking ? 'animate-shake' : ''
              }`}
              style={{
                minWidth: 80,
                minHeight: 80,
                fontSize: '2.2rem',
                fontWeight: 'bold',
                borderRadius: 20,
                background: isHinted
                  ? `linear-gradient(135deg, ${color}, ${color}cc)`
                  : `linear-gradient(135deg, ${color}20, ${color}40)`,
                color: isHinted ? '#fff' : color,
                border: isHinted
                  ? `3px solid ${color}`
                  : `3px solid ${color}50`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                animation: isHinted ? 'hintPulse 0.5s ease-in-out 2' : 'none',
              }}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Hint button */}
      {config.hintsAvailable && (
        <button
          onClick={handleHint}
          className="mb-2 px-6 py-3 rounded-full bg-yellow-100 text-yellow-700
                     font-semibold text-sm active:scale-95 transition-transform"
        >
          💡 Dica
        </button>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes popIn {
          0% { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes hintPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          50% { transform: scale(1.1); box-shadow: 0 0 20px 8px rgba(99, 102, 241, 0.3); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-12px); }
          40% { transform: translateX(12px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
