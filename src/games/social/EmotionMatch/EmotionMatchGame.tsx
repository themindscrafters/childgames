import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../shared/DifficultyManager';
import { RewardSystem } from '../../shared/RewardSystem';
import { audioManager } from '../../shared/AudioManager';
import { saveSession } from '../../../data/db';
import { useApp } from '../../../hooks/useAppContext';
import { GameComplete } from '../../../components/GameSelector/GameComplete';
import type { Difficulty } from '../../../data/models';

interface Emotion {
  emoji: string;
  label: string;
  id: string;
}

interface Scenario {
  text: string;
  correctEmotion: string;
}

const EMOTIONS: Emotion[] = [
  { emoji: '\u{1F60A}', label: 'Feliz', id: 'feliz' },
  { emoji: '\u{1F622}', label: 'Triste', id: 'triste' },
  { emoji: '\u{1F620}', label: 'Bravo', id: 'bravo' },
  { emoji: '\u{1F628}', label: 'Com medo', id: 'medo' },
  { emoji: '\u{1F632}', label: 'Surpreso', id: 'surpreso' },
  { emoji: '\u{1F917}', label: 'Carinhoso', id: 'carinhoso' },
];

const SCENARIOS: Scenario[] = [
  { text: 'Voce ganhou um presente!', correctEmotion: 'feliz' },
  { text: 'Seu brinquedo favorito quebrou.', correctEmotion: 'triste' },
  { text: 'Alguem pegou seu lanche sem pedir.', correctEmotion: 'bravo' },
  { text: 'Voce ouviu um barulho estranho no escuro.', correctEmotion: 'medo' },
  { text: 'Sua mae preparou uma festa surpresa!', correctEmotion: 'surpreso' },
  { text: 'Voce deu um abraco no seu melhor amigo.', correctEmotion: 'carinhoso' },
  { text: 'Voce tirou nota boa na prova!', correctEmotion: 'feliz' },
  { text: 'Seu amigo se mudou para longe.', correctEmotion: 'triste' },
  { text: 'Alguem empurrou voce na fila.', correctEmotion: 'bravo' },
  { text: 'Voce viu um cachorro muito grande correndo na sua direcao.', correctEmotion: 'medo' },
  { text: 'Voce encontrou dinheiro no bolso!', correctEmotion: 'surpreso' },
  { text: 'Voce cuidou de um gatinho perdido.', correctEmotion: 'carinhoso' },
  { text: 'Voce fez um desenho muito bonito!', correctEmotion: 'feliz' },
  { text: 'Comecou a chover e voce nao pode brincar la fora.', correctEmotion: 'triste' },
  { text: 'Alguem riscou o seu caderno.', correctEmotion: 'bravo' },
  { text: 'As luzes apagaram de repente!', correctEmotion: 'medo' },
  { text: 'Voce ganhou um filhote de cachorro!', correctEmotion: 'surpreso' },
  { text: 'Voce ajudou a vovo a atravessar a rua.', correctEmotion: 'carinhoso' },
];

const ROUND_CONFIG: Record<Difficulty, { rounds: number; optionCount: number }> = {
  easy: { rounds: 3, optionCount: 2 },
  medium: { rounds: 5, optionCount: 3 },
  hard: { rounds: 7, optionCount: 4 },
};

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function EmotionMatchGame() {
  const { currentStudent } = useApp();
  const difficultyRef = useRef(new DifficultyManager(currentStudent?.current_difficulty ?? 'easy'));
  const rewardRef = useRef(new RewardSystem());

  const [, setDifficulty] = useState<Difficulty>(difficultyRef.current.getDifficulty());
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(3);
  const [optionCount, setOptionCount] = useState(2);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [options, setOptions] = useState<Emotion[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [correctId, setCorrectId] = useState<string | null>(null);
  const [showStars, setShowStars] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const startTimeRef = useRef(new Date());

  const generateOptions = useCallback(
    (correctEmotionId: string, count: number): Emotion[] => {
      const correct = EMOTIONS.find((e) => e.id === correctEmotionId)!;
      const others = shuffleArray(EMOTIONS.filter((e) => e.id !== correctEmotionId));
      const selected = [correct, ...others.slice(0, count - 1)];
      return shuffleArray(selected);
    },
    []
  );

  const setupRound = useCallback(
    (roundIndex: number, scenarioList: Scenario[], numOptions: number) => {
      if (roundIndex >= scenarioList.length) return;
      const scenario = scenarioList[roundIndex];
      const opts = generateOptions(scenario.correctEmotion, numOptions);
      setOptions(opts);
      setSelectedId(null);
      setCorrectId(null);
      setShowStars(false);
      setIsTransitioning(false);

      setTimeout(() => {
        audioManager.speak(scenario.text);
      }, 400);
    },
    [generateOptions]
  );

  const initGame = useCallback(() => {
    const diff = difficultyRef.current.getDifficulty();
    const config = ROUND_CONFIG[diff];
    const shuffled = shuffleArray([...SCENARIOS]).slice(0, config.rounds);

    setDifficulty(diff);
    setTotalRounds(config.rounds);
    setOptionCount(config.optionCount);
    setScenarios(shuffled);
    setCurrentRound(0);
    setScore(0);
    setGameComplete(false);
    setMessage('');
    setAttempts(0);
    setCorrectAnswers(0);
    rewardRef.current.reset();
    startTimeRef.current = new Date();

    audioManager.speak('Como voce se sentiria?');
    setTimeout(() => {
      setupRound(0, shuffled, config.optionCount);
    }, 1500);
  }, [setupRound]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleEmotionSelect = useCallback(
    async (emotionId: string) => {
      if (selectedId || isTransitioning || gameComplete) return;
      if (currentRound >= scenarios.length) return;

      const scenario = scenarios[currentRound];
      const isCorrect = emotionId === scenario.correctEmotion;
      setSelectedId(emotionId);
      setAttempts((a) => a + 1);

      if (isCorrect) {
        setCorrectId(emotionId);
        setShowStars(true);
        audioManager.playCorrect();
        const reward = rewardRef.current.recordCorrect();
        difficultyRef.current.recordAnswer(true);
        setScore((s) => s + 10);
        setCorrectAnswers((c) => c + 1);
        setMessage(reward.message);

        setIsTransitioning(true);
        const nextRound = currentRound + 1;

        if (nextRound >= totalRounds) {
          setTimeout(async () => {
            setGameComplete(true);
            if (currentStudent?.id) {
              await saveSession({
                student_id: currentStudent.id,
                game_id: 'emotion-match',
                started_at: startTimeRef.current?.toISOString() ?? new Date().toISOString(),
                ended_at: new Date().toISOString(),
                difficulty: difficultyRef.current.getDifficulty(),
                score: score + 10,
                total_questions: totalRounds,
                correct_answers: correctAnswers + 1,
                attempts: attempts + 1,
                hints_used: 0,
                completed: true,
              });
            }
          }, 1500);
        } else {
          setTimeout(() => {
            setCurrentRound(nextRound);
            setupRound(nextRound, scenarios, optionCount);
          }, 2000);
        }
      } else {
        audioManager.playWrong();
        rewardRef.current.recordWrong();
        difficultyRef.current.recordAnswer(false);
        setMessage('Tente de novo!');

        setTimeout(() => {
          setSelectedId(null);
          setMessage('');
        }, 1200);
      }
    },
    [
      selectedId,
      isTransitioning,
      gameComplete,
      currentRound,
      scenarios,
      totalRounds,
      setupRound,
      optionCount,
      currentStudent,
      score,
      correctAnswers,
      attempts,
    ]
  );

  const currentScenario = scenarios[currentRound];

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardRef.current.getState()}
        gameName="Mundo das Emocoes"
        onPlayAgain={initGame}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Mundo das Emocoes</h2>
        <div style={styles.statsRow}>
          <span style={styles.stat}>⭐ {score}</span>
          <span style={styles.stat}>
            {currentRound + 1}/{totalRounds}
          </span>
          <span style={styles.diffBadge}>{difficultyRef.current.getConfig().label}</span>
        </div>
      </div>

      {message && (
        <div style={styles.messageBar} key={message + Date.now()}>
          {message}
        </div>
      )}

      <div style={styles.progressBarOuter}>
        <div
          style={{
            ...styles.progressBarInner,
            width: `${totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0}%`,
          }}
        />
      </div>

      {currentScenario && (
        <div style={styles.scenarioCard}>
          <p style={styles.scenarioText}>{currentScenario.text}</p>
          <button
            onClick={() => audioManager.speak(currentScenario.text)}
            style={styles.speakBtn}
            aria-label="Ouvir novamente"
          >
            🔊 Ouvir
          </button>
        </div>
      )}

      <p style={styles.questionLabel}>Como voce se sentiria?</p>

      <div
        style={{
          ...styles.emotionGrid,
          gridTemplateColumns:
            optionCount <= 2
              ? 'repeat(2, 1fr)'
              : optionCount === 3
              ? 'repeat(3, 1fr)'
              : 'repeat(2, 1fr)',
        }}
      >
        {options.map((emotion) => {
          const isSelected = selectedId === emotion.id;
          const isCorrectChoice = correctId === emotion.id;
          const isWrongChoice = isSelected && !isCorrectChoice && selectedId !== null;

          return (
            <button
              key={emotion.id}
              onClick={() => handleEmotionSelect(emotion.id)}
              disabled={isTransitioning}
              style={{
                ...styles.emotionBtn,
                background: isCorrectChoice
                  ? '#D1FAE5'
                  : isWrongChoice
                  ? '#FEE2E2'
                  : '#fff',
                borderColor: isCorrectChoice
                  ? '#10B981'
                  : isWrongChoice
                  ? '#EF4444'
                  : '#E5E7EB',
                transform: isCorrectChoice
                  ? 'scale(1.1)'
                  : isWrongChoice
                  ? 'translateX(-4px)'
                  : 'scale(1)',
              }}
              aria-label={emotion.label}
            >
              <span
                style={{
                  ...styles.emotionEmoji,
                  transform: isCorrectChoice ? 'scale(1.3)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                }}
              >
                {emotion.emoji}
              </span>
              <span style={styles.emotionLabel}>{emotion.label}</span>

              {isCorrectChoice && showStars && (
                <div style={styles.starsContainer}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      style={{
                        ...styles.star,
                        animationDelay: `${i * 0.1}s`,
                        left: `${10 + i * 18}%`,
                        top: `${Math.random() * 30}%`,
                      }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeInMsg {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes starBurst {
          0% { opacity: 0; transform: scale(0) translateY(0); }
          50% { opacity: 1; transform: scale(1.2) translateY(-15px); }
          100% { opacity: 0; transform: scale(0.5) translateY(-30px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '16px',
    gap: '12px',
    background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 50%, #FBCFE8 100%)',
    fontFamily: 'inherit',
    overflowY: 'auto',
  },
  header: {
    textAlign: 'center',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#9D174D',
    margin: 0,
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '6px',
    flexWrap: 'wrap' as const,
  },
  stat: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#831843',
  },
  diffBadge: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#fff',
    background: '#F472B6',
    borderRadius: '12px',
    padding: '2px 12px',
  },
  messageBar: {
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#DB2777',
    animation: 'fadeInMsg 0.3s ease',
    minHeight: '1.5em',
  },
  progressBarOuter: {
    width: '100%',
    height: '10px',
    borderRadius: '5px',
    background: '#FBCFE8',
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    background: 'linear-gradient(90deg, #F472B6, #EC4899)',
    borderRadius: '5px',
    transition: 'width 0.5s ease',
  },
  scenarioCard: {
    background: '#fff',
    borderRadius: '20px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(236, 72, 153, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  scenarioText: {
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#1F2937',
    lineHeight: 1.5,
    margin: 0,
  },
  speakBtn: {
    background: '#F472B6',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    padding: '8px 20px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  },
  questionLabel: {
    textAlign: 'center',
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#9D174D',
    margin: 0,
  },
  emotionGrid: {
    display: 'grid',
    gap: '12px',
    maxHeight: '60vh',
    alignContent: 'center',
    maxWidth: '440px',
    width: '100%',
    margin: '0 auto',
  },
  emotionBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '16px 8px',
    minWidth: '80px',
    minHeight: '100px',
    borderRadius: '20px',
    border: '3px solid #E5E7EB',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  emotionEmoji: {
    fontSize: '3rem',
    lineHeight: 1,
  },
  emotionLabel: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#4B5563',
  },
  starsContainer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  star: {
    position: 'absolute',
    fontSize: '1.2rem',
    animation: 'starBurst 0.8s ease forwards',
  },
};
