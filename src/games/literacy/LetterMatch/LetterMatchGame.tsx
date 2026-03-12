import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DifficultyManager } from '../../shared/DifficultyManager';
import { RewardSystem } from '../../shared/RewardSystem';
import { audioManager } from '../../shared/AudioManager';
import { saveSession } from '../../../data/db';
import { useApp } from '../../../hooks/useAppContext';
import { GameComplete } from '../../../components/GameSelector/GameComplete';

const LETTER_NAMES: Record<string, string> = {
  A: 'a', B: 'be', C: 'ce', D: 'de', E: 'e', F: 'efe',
  G: 'ge', H: 'aga', I: 'i', J: 'jota', K: 'ca', L: 'ele',
  M: 'eme', N: 'ene', O: 'o', P: 'pe', Q: 'que', R: 'erre',
  S: 'esse', T: 'te', U: 'u', V: 've', W: 'dablio', X: 'xis',
  Y: 'ipsilon', Z: 'ze',
};

const ALL_LETTERS = Object.keys(LETTER_NAMES);

const LETTER_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#F97316', '#14B8A6', '#6366F1', '#D946EF',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], count: number, exclude?: T[]): T[] {
  const pool = exclude ? arr.filter((x) => !exclude.includes(x)) : [...arr];
  const result: T[] = [];
  while (result.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

interface RoundData {
  targetLetter: string;
  options: string[];
}

export function LetterMatchGame() {
  const { currentStudent } = useApp();
  const difficultyRef = useRef(
    new DifficultyManager(currentStudent?.currentDifficulty ?? 'easy')
  );
  const rewardRef = useRef(new RewardSystem());

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [startedAt] = useState(new Date());
  const [isSpeaking, setIsSpeaking] = useState(false);

  const config = difficultyRef.current.getConfig();
  const totalRounds = config.itemCount;

  const rounds = useMemo(() => {
    const cfg = difficultyRef.current.getConfig();
    const generated: RoundData[] = [];
    const usedLetters: string[] = [];
    for (let i = 0; i < cfg.itemCount; i++) {
      const available = ALL_LETTERS.filter((l) => !usedLetters.includes(l));
      const target = available[Math.floor(Math.random() * available.length)];
      usedLetters.push(target);
      const distractors = pickRandom(ALL_LETTERS, cfg.optionCount - 1, [target]);
      generated.push({
        targetLetter: target,
        options: shuffle([target, ...distractors]),
      });
    }
    return generated;
  }, [gameComplete]);

  const currentRound = rounds[round];

  const speakLetter = useCallback(async (letter: string) => {
    setIsSpeaking(true);
    const name = LETTER_NAMES[letter];
    await audioManager.speak(`A letra ${name}`, 0.8);
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    if (currentRound && !gameComplete) {
      const timer = setTimeout(() => {
        speakLetter(currentRound.targetLetter);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [round, currentRound, gameComplete, speakLetter]);

  const handleSelect = useCallback(
    async (letter: string) => {
      if (feedback || gameComplete) return;

      setAttempts((a) => a + 1);
      setSelectedLetter(letter);

      if (letter === currentRound.targetLetter) {
        setFeedback('correct');
        audioManager.playCorrect();
        const reward = rewardRef.current.recordCorrect();
        difficultyRef.current.recordAnswer(true);
        setScore((s) => s + 1);
        setMessage(reward.message);

        setTimeout(() => {
          setFeedback(null);
          setSelectedLetter(null);
          setMessage('');
          if (round + 1 >= totalRounds) {
            finishGame();
          } else {
            setRound((r) => r + 1);
          }
        }, 1200);
      } else {
        setFeedback('wrong');
        audioManager.playWrong();
        const reward = rewardRef.current.recordWrong();
        difficultyRef.current.recordAnswer(false);
        setMessage(reward.message);

        setTimeout(() => {
          setFeedback(null);
          setSelectedLetter(null);
          setMessage('');
        }, 1000);
      }
    },
    [feedback, gameComplete, currentRound, round, totalRounds]
  );

  const finishGame = useCallback(async () => {
    setGameComplete(true);
    if (currentStudent?.id) {
      await saveSession({
        studentId: currentStudent.id,
        gameId: 'letter-match',
        startedAt,
        endedAt: new Date(),
        difficulty: difficultyRef.current.getDifficulty(),
        score,
        totalQuestions: totalRounds,
        correctAnswers: score,
        attempts,
        hintsUsed,
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
    setFeedback(null);
    setSelectedLetter(null);
    setMessage('');
    setGameComplete(false);
  }, []);

  const handleHint = useCallback(() => {
    if (!config.hintsAvailable || !currentRound) return;
    setHintsUsed((h) => h + 1);
    setSelectedLetter(currentRound.targetLetter);
    audioManager.playSelect();
    setTimeout(() => setSelectedLetter(null), 800);
  }, [config.hintsAvailable, currentRound]);

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardRef.current.getState()}
        gameName="Letra e Som"
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (!currentRound) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 gap-4 select-none overflow-y-auto">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-bold text-yellow-500">{score}</span>
        </div>
        <div className="bg-white/80 rounded-full px-4 py-1 text-sm font-semibold text-gray-600">
          {round + 1} / {totalRounds}
        </div>
        <div className="text-sm font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
          {config.label}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${((round) / totalRounds) * 100}%` }}
        />
      </div>

      {/* Prompt area */}
      <div className="flex flex-col items-center gap-3 justify-center">
        <p className="text-lg text-gray-600 font-medium">
          Toque na letra que voce ouviu!
        </p>

        {/* Speaker button */}
        <button
          onClick={() => speakLetter(currentRound.targetLetter)}
          disabled={isSpeaking}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
                     flex items-center justify-center shadow-xl active:scale-95 transition-transform"
          style={{
            animation: isSpeaking ? 'pulse 1s infinite' : 'none',
          }}
        >
          <span className="text-5xl">🔊</span>
        </button>

        <p className="text-sm text-gray-400 italic">
          Toque para ouvir novamente
        </p>

        {/* Feedback message */}
        {message && (
          <div
            className={`text-xl font-bold px-6 py-2 rounded-2xl ${
              feedback === 'correct'
                ? 'bg-green-100 text-green-600'
                : 'bg-orange-100 text-orange-600'
            }`}
            style={{ animation: 'bounceIn 0.4s ease-out' }}
          >
            {message}
          </div>
        )}
      </div>

      {/* Letter options */}
      <div className="flex flex-wrap items-center justify-center gap-4 pb-4">
        {currentRound.options.map((letter, idx) => {
          const isSelected = selectedLetter === letter;
          const isCorrectAnswer = letter === currentRound.targetLetter;
          const color = LETTER_COLORS[idx % LETTER_COLORS.length];

          let btnStyle: React.CSSProperties = {
            minWidth: 90,
            minHeight: 90,
            fontSize: '2.5rem',
            fontWeight: 'bold',
            borderRadius: 20,
            border: '4px solid transparent',
            background: `linear-gradient(135deg, ${color}22, ${color}44)`,
            color: color,
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          };

          let animClass = '';

          if (feedback && isSelected && feedback === 'correct') {
            btnStyle = {
              ...btnStyle,
              background: '#10B981',
              color: '#fff',
              border: '4px solid #059669',
              transform: 'scale(1.1)',
            };
          } else if (feedback && isSelected && feedback === 'wrong') {
            btnStyle = {
              ...btnStyle,
              background: '#FEE2E2',
              color: '#EF4444',
              border: '4px solid #EF4444',
            };
            animClass = 'animate-shake';
          } else if (feedback === 'correct' && isCorrectAnswer && !isSelected) {
            btnStyle = {
              ...btnStyle,
              background: '#D1FAE5',
              color: '#059669',
              border: '4px solid #10B981',
            };
          }

          return (
            <button
              key={letter}
              onClick={() => handleSelect(letter)}
              disabled={!!feedback}
              className={`shadow-lg active:scale-95 ${animClass}`}
              style={btnStyle}
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
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
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
