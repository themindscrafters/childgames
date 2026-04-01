import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DifficultyManager } from '../../shared/DifficultyManager';
import { RewardSystem } from '../../shared/RewardSystem';
import { audioManager } from '../../shared/AudioManager';
import { saveSession } from '../../../data/db';
import { useApp } from '../../../hooks/useAppContext';
import { GameComplete } from '../../../components/GameSelector/GameComplete';

interface WordEntry {
  word: string;
  syllables: string[];
  hint: string;
}

const EASY_WORDS: WordEntry[] = [
  { word: 'GATO', syllables: ['GA', 'TO'], hint: '🐱' },
  { word: 'BOLA', syllables: ['BO', 'LA'], hint: '⚽' },
  { word: 'CASA', syllables: ['CA', 'SA'], hint: '🏠' },
  { word: 'PATO', syllables: ['PA', 'TO'], hint: '🦆' },
  { word: 'MALA', syllables: ['MA', 'LA'], hint: '💼' },
  { word: 'SAPO', syllables: ['SA', 'PO'], hint: '🐸' },
  { word: 'LOBO', syllables: ['LO', 'BO'], hint: '🐺' },
  { word: 'VACA', syllables: ['VA', 'CA'], hint: '🐄' },
  { word: 'RATO', syllables: ['RA', 'TO'], hint: '🐭' },
  { word: 'FOGO', syllables: ['FO', 'GO'], hint: '🔥' },
];

const MEDIUM_WORDS: WordEntry[] = [
  { word: 'CAVALO', syllables: ['CA', 'VA', 'LO'], hint: '🐴' },
  { word: 'BANANA', syllables: ['BA', 'NA', 'NA'], hint: '🍌' },
  { word: 'MACACO', syllables: ['MA', 'CA', 'CO'], hint: '🐒' },
  { word: 'JANELA', syllables: ['JA', 'NE', 'LA'], hint: '🪟' },
  { word: 'BONECA', syllables: ['BO', 'NE', 'CA'], hint: '🧸' },
  { word: 'SAPATO', syllables: ['SA', 'PA', 'TO'], hint: '👟' },
  { word: 'TOMATE', syllables: ['TO', 'MA', 'TE'], hint: '🍅' },
  { word: 'GIRAFA', syllables: ['GI', 'RA', 'FA'], hint: '🦒' },
  { word: 'GALINHA', syllables: ['GA', 'LI', 'NHA'], hint: '🐔' },
  { word: 'COELHO', syllables: ['CO', 'E', 'LHO'], hint: '🐰' },
];

const HARD_WORDS: WordEntry[] = [
  { word: 'BORBOLETA', syllables: ['BOR', 'BO', 'LE', 'TA'], hint: '🦋' },
  { word: 'ELEFANTE', syllables: ['E', 'LE', 'FAN', 'TE'], hint: '🐘' },
  { word: 'ABACAXI', syllables: ['A', 'BA', 'CA', 'XI'], hint: '🍍' },
  { word: 'TARTARUGA', syllables: ['TAR', 'TA', 'RU', 'GA'], hint: '🐢' },
  { word: 'CHOCOLATE', syllables: ['CHO', 'CO', 'LA', 'TE'], hint: '🍫' },
  { word: 'PASSARINHO', syllables: ['PAS', 'SA', 'RI', 'NHO'], hint: '🐦' },
  { word: 'BICICLETA', syllables: ['BI', 'CI', 'CLE', 'TA'], hint: '🚲' },
  { word: 'DINOSSAURO', syllables: ['DI', 'NOS', 'SAU', 'RO'], hint: '🦕' },
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
    case 'medium': return [...EASY_WORDS, ...MEDIUM_WORDS];
    case 'hard': return [...MEDIUM_WORDS, ...HARD_WORDS];
    default: return EASY_WORDS;
  }
}

const SLOT_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
const BUTTON_COLORS = [
  '#4F46E5', '#7C3AED', '#EC4899', '#F97316', '#10B981',
  '#EF4444', '#3B82F6', '#D946EF', '#14B8A6', '#F59E0B',
];

export function SyllablePuzzleGame() {
  const { currentStudent } = useApp();
  const difficultyRef = useRef(
    new DifficultyManager(currentStudent?.current_difficulty ?? 'easy')
  );
  const rewardRef = useRef(new RewardSystem());

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [placedSyllables, setPlacedSyllables] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'complete' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [startedAt] = useState(new Date().toISOString());
  const [shakeSyllable, setShakeSyllable] = useState<string | null>(null);

  const config = difficultyRef.current.getConfig();
  const totalRounds = config.itemCount;

  const wordList = useMemo(() => {
    const pool = getWordPool(difficultyRef.current.getDifficulty());
    return shuffle(pool).slice(0, totalRounds);
  }, [gameComplete]);

  const currentWord = wordList[round];

  const shuffledSyllables = useMemo(() => {
    if (!currentWord) return [];
    return shuffle(currentWord.syllables);
  }, [currentWord]);

  const nextExpectedIndex = placedSyllables.length;

  useEffect(() => {
    if (currentWord && !gameComplete) {
      const timer = setTimeout(() => {
        audioManager.speak(currentWord.word, 0.7);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [round, currentWord, gameComplete]);

  const handleTapSyllable = useCallback(
    (syllable: string) => {
      if (feedback === 'complete' || gameComplete || !currentWord) return;

      setAttempts((a) => a + 1);
      const expected = currentWord.syllables[nextExpectedIndex];

      if (syllable === expected) {
        audioManager.playCorrect();
        const newPlaced = [...placedSyllables, syllable];
        setPlacedSyllables(newPlaced);

        if (newPlaced.length === currentWord.syllables.length) {
          // Word complete
          setFeedback('complete');
          const reward = rewardRef.current.recordCorrect();
          difficultyRef.current.recordAnswer(true);
          setScore((s) => s + 1);
          setMessage(reward.message);

          audioManager.speak(`${currentWord.word}! ${reward.message}`, 0.8);

          setTimeout(() => {
            setFeedback(null);
            setPlacedSyllables([]);
            setMessage('');
            if (round + 1 >= totalRounds) {
              finishGame();
            } else {
              setRound((r) => r + 1);
            }
          }, 1800);
        } else {
          setFeedback('correct');
          setTimeout(() => setFeedback(null), 400);
        }
      } else {
        setFeedback('wrong');
        setShakeSyllable(syllable);
        audioManager.playWrong();
        const reward = rewardRef.current.recordWrong();
        difficultyRef.current.recordAnswer(false);
        setMessage(reward.message);

        setTimeout(() => {
          setFeedback(null);
          setShakeSyllable(null);
          setMessage('');
        }, 800);
      }
    },
    [feedback, gameComplete, currentWord, nextExpectedIndex, placedSyllables, round, totalRounds]
  );

  const finishGame = useCallback(async () => {
    setGameComplete(true);
    if (currentStudent?.id) {
      await saveSession({
        student_id: currentStudent.id,
        game_id: 'syllable-puzzle',
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
    setPlacedSyllables([]);
    setFeedback(null);
    setMessage('');
    setGameComplete(false);
  }, []);

  const handleHint = useCallback(() => {
    if (!config.hintsAvailable || !currentWord) return;
    setHintsUsed((h) => h + 1);
    const next = currentWord.syllables[nextExpectedIndex];
    if (next) {
      audioManager.speak(next, 0.7);
      // Flash the correct syllable
      setShakeSyllable(next);
      setTimeout(() => setShakeSyllable(null), 600);
    }
  }, [config.hintsAvailable, currentWord, nextExpectedIndex]);

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardRef.current.getState()}
        gameName="Quebra-Silabas"
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (!currentWord) return null;

  // Build a proper remaining list: remove placed syllables from shuffled
  const availableSyllables = (() => {
    const placed = [...placedSyllables];
    return shuffledSyllables.filter((s) => {
      const idx = placed.indexOf(s);
      if (idx !== -1) {
        placed.splice(idx, 1);
        return false;
      }
      return true;
    });
  })();

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
        <div className="text-sm font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-700">
          {config.label}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500"
          style={{ width: `${((round) / totalRounds) * 100}%` }}
        />
      </div>

      {/* Word hint area */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <p className="text-base text-gray-500 font-medium">
          Monte a palavra tocando nas silabas!
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

      {/* Slots */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {currentWord.syllables.map((_syl, idx) => {
          const isPlaced = idx < placedSyllables.length;
          const color = SLOT_COLORS[idx % SLOT_COLORS.length];
          return (
            <div
              key={idx}
              className="flex items-center justify-center rounded-2xl transition-all duration-300"
              style={{
                minWidth: 80,
                minHeight: 80,
                fontSize: '1.8rem',
                fontWeight: 'bold',
                background: isPlaced ? color : `${color}15`,
                color: isPlaced ? '#fff' : `${color}40`,
                border: `3px dashed ${isPlaced ? 'transparent' : color}`,
                transform: isPlaced ? 'scale(1)' : 'scale(0.95)',
                animation: isPlaced ? 'snapIn 0.3s ease-out' : 'none',
              }}
            >
              {isPlaced ? placedSyllables[idx] : '?'}
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      {message && (
        <div
          className={`text-xl font-bold px-6 py-2 rounded-2xl ${
            feedback === 'complete' || feedback === 'correct'
              ? 'bg-green-100 text-green-600'
              : 'bg-orange-100 text-orange-600'
          }`}
          style={{ animation: 'bounceIn 0.4s ease-out' }}
        >
          {message}
        </div>
      )}

      {/* Syllable buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pb-2">
        {availableSyllables.map((syl, idx) => {
          const isShaking = shakeSyllable === syl;
          const isHinted = shakeSyllable === syl && feedback === null;
          const color = BUTTON_COLORS[idx % BUTTON_COLORS.length];

          return (
            <button
              key={`${syl}-${idx}`}
              onClick={() => handleTapSyllable(syl)}
              disabled={feedback === 'complete'}
              className={`shadow-lg active:scale-95 transition-transform ${
                isShaking && feedback === 'wrong' ? 'animate-shake' : ''
              }`}
              style={{
                minWidth: 90,
                minHeight: 90,
                fontSize: '1.6rem',
                fontWeight: 'bold',
                borderRadius: 20,
                background: isHinted
                  ? `linear-gradient(135deg, ${color}, ${color}cc)`
                  : `linear-gradient(135deg, ${color}20, ${color}40)`,
                color: isHinted ? '#fff' : color,
                border: `3px solid ${color}60`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {syl}
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
        @keyframes snapIn {
          0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
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
