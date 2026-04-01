import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../../shared/DifficultyManager';
import { RewardSystem } from '../../../shared/RewardSystem';
import { audioManager } from '../../../shared/AudioManager';
import { saveSession } from '../../../../data/db';
import { useApp } from '../../../../hooks/useAppContext';
import { GameComplete } from '../../../../components/GameSelector/GameComplete';
import {
  getGrammarQuestions,
  WORD_CLASS_LABELS,
  WORD_CLASS_COLORS,
  type GrammarQuestion,
  type WordClass,
} from './grammarData';

const TOTAL_ROUNDS = 10;

export function WordClassesGame() {
  const { currentStudent } = useApp();
  const difficultyManager = useRef(
    new DifficultyManager(currentStudent?.current_difficulty ?? 'easy')
  ).current;
  const rewardSystem = useRef(new RewardSystem()).current;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');

  const [currentQuestion, setCurrentQuestion] = useState<GrammarQuestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [wordsVisible, setWordsVisible] = useState(false);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

  const startTime = useRef(new Date());

  const generateRound = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const questions = getGrammarQuestions(diff);

    let availableIndices = Array.from({ length: questions.length }, (_, i) => i).filter(
      (i) => !usedIndices.has(i)
    );

    if (availableIndices.length === 0) {
      setUsedIndices(new Set());
      availableIndices = Array.from({ length: questions.length }, (_, i) => i);
    }

    const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setUsedIndices((prev) => new Set(prev).add(randomIdx));

    const question = questions[randomIdx];
    setCurrentQuestion(question);
    setSelectedIndex(null);
    setFeedback(null);
    setWordsVisible(false);

    setTimeout(() => setWordsVisible(true), 100);
    audioManager.speak(
      `Encontre o ${WORD_CLASS_LABELS[question.targetClass]} na frase.`
    );
  }, [difficultyManager, usedIndices]);

  useEffect(() => {
    generateRound();
  }, []);

  const handleSelect = useCallback(
    (wordIndex: number) => {
      if (feedback !== null || !currentQuestion) return;

      setSelectedIndex(wordIndex);
      setAttempts((a) => a + 1);

      const word = currentQuestion.words[wordIndex];
      audioManager.speak(word.text);

      if (wordIndex === currentQuestion.correctWordIndex) {
        setFeedback('correct');
        setScore((s) => s + 1);
        const rewardState = rewardSystem.recordCorrect();
        difficultyManager.recordAnswer(true);
        setMessage(rewardState.message);
        audioManager.playCorrect();

        setTimeout(() => {
          const nextRound = round + 1;
          if (nextRound >= TOTAL_ROUNDS) {
            finishGame(score + 1);
          } else {
            setRound(nextRound);
            generateRound();
          }
        }, 1500);
      } else {
        setFeedback('wrong');
        const rewardState = rewardSystem.recordWrong();
        difficultyManager.recordAnswer(false);
        setMessage(rewardState.message);
        audioManager.playWrong();

        setTimeout(() => {
          setFeedback(null);
          setSelectedIndex(null);
        }, 1200);
      }
    },
    [feedback, currentQuestion, round, score, generateRound, rewardSystem, difficultyManager]
  );

  const finishGame = useCallback(
    async (finalScore: number) => {
      setGameComplete(true);
      if (currentStudent?.id) {
        await saveSession({
          student_id: currentStudent.id,
          game_id: 'word-classes',
          started_at: startTime.current.toISOString(),
          ended_at: new Date().toISOString(),
          difficulty: difficultyManager.getDifficulty(),
          score: finalScore,
          total_questions: TOTAL_ROUNDS,
          correct_answers: finalScore,
          attempts,
          hints_used: hintsUsed,
          completed: true,
        });
      }
    },
    [currentStudent, difficultyManager, attempts, hintsUsed]
  );

  const handlePlayAgain = useCallback(() => {
    difficultyManager.reset();
    rewardSystem.reset();
    setRound(0);
    setScore(0);
    setAttempts(0);
    setHintsUsed(0);
    setGameComplete(false);
    setUsedIndices(new Set());
    startTime.current = new Date();
    generateRound();
  }, [difficultyManager, rewardSystem, generateRound]);

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardSystem.getState()}
        gameName="Classes de Palavras"
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (!currentQuestion) return null;

  const diffLabel =
    difficultyManager.getDifficulty() === 'easy'
      ? 'Fácil'
      : difficultyManager.getDifficulty() === 'medium'
        ? 'Médio'
        : 'Difícil';

  const targetColor = WORD_CLASS_COLORS[currentQuestion.targetClass];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '16px',
        gap: '16px',
        fontFamily: "'Baloo 2', system-ui, sans-serif",
        userSelect: 'none',
        WebkitUserSelect: 'none',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '600px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>{'📝'}</span>
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '18px',
              color: '#6366F1',
            }}
          >
            Classes de Palavras
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              background: '#FEF3C7',
              borderRadius: '16px',
              padding: '4px 12px',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {diffLabel}
          </span>
          <span style={{ fontSize: '14px', color: '#6B7280' }}>
            {round + 1}/{TOTAL_ROUNDS}
          </span>
          <span style={{ fontSize: '20px' }}>
            {'\u2B50'} {score}
          </span>
        </div>
      </div>

      {/* Reward streak */}
      {rewardSystem.getState().streak >= 2 && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#F59E0B',
            fontWeight: 'bold',
          }}
        >
          {'\uD83D\uDD25'} {rewardSystem.getState().streak} seguidos!
        </div>
      )}

      {/* Target class instruction */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: '18px',
            color: '#374151',
            fontWeight: 600,
          }}
        >
          Encontre o:
        </div>
        <div
          style={{
            background: targetColor,
            color: '#FFFFFF',
            padding: '10px 28px',
            borderRadius: '20px',
            fontSize: '22px',
            fontWeight: 'bold',
            boxShadow: `0 4px 14px ${targetColor}44`,
            letterSpacing: '1px',
            transform: wordsVisible ? 'scale(1)' : 'scale(0.8)',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {WORD_CLASS_LABELS[currentQuestion.targetClass].toUpperCase()}
        </div>
      </div>

      {/* Sentence display area */}
      <div
        style={{
          background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)',
          borderRadius: '24px',
          border: '3px solid #C7D2FE',
          padding: '24px 20px',
          width: '100%',
          maxWidth: '600px',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            color: '#6B7280',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Toque na palavra correta
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          {currentQuestion.words.map((word, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrectAnswer = feedback === 'correct' && idx === currentQuestion.correctWordIndex;
            const isWrongAnswer = feedback === 'wrong' && isSelected;
            const showCorrectHint = feedback === 'wrong' && idx === currentQuestion.correctWordIndex;

            let bgColor = '#FFFFFF';
            let borderColor = '#D1D5DB';
            let textColor = '#1F2937';
            let scale = 'scale(1)';
            let shadowColor = 'rgba(0,0,0,0.06)';

            if (isCorrectAnswer) {
              bgColor = '#D1FAE5';
              borderColor = '#10B981';
              textColor = '#065F46';
              scale = 'scale(1.1)';
              shadowColor = 'rgba(16,185,129,0.3)';
            } else if (isWrongAnswer) {
              bgColor = '#FEE2E2';
              borderColor = '#EF4444';
              textColor = '#991B1B';
              scale = 'scale(0.95)';
              shadowColor = 'rgba(239,68,68,0.3)';
            } else if (showCorrectHint) {
              bgColor = '#DBEAFE';
              borderColor = '#3B82F6';
              textColor = '#1E40AF';
            }

            return (
              <button
                key={`${round}-${idx}`}
                onClick={() => handleSelect(idx)}
                disabled={feedback !== null}
                style={{
                  padding: '10px 18px',
                  borderRadius: '14px',
                  border: `3px solid ${borderColor}`,
                  background: bgColor,
                  color: textColor,
                  fontSize: '20px',
                  fontWeight: 'bold',
                  fontFamily: "'Baloo 2', system-ui, sans-serif",
                  cursor: feedback !== null ? 'default' : 'pointer',
                  transition: 'all 0.25s ease',
                  transform: wordsVisible
                    ? scale
                    : 'scale(0) translateY(20px)',
                  transitionDelay: wordsVisible ? `${idx * 0.06}s` : '0s',
                  boxShadow: `0 3px 10px ${shadowColor}`,
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  opacity: wordsVisible ? 1 : 0,
                }}
              >
                {word.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback message */}
      <div
        style={{
          textAlign: 'center',
          minHeight: '32px',
          fontSize: '20px',
          fontWeight: 'bold',
          color:
            feedback === 'correct'
              ? '#10B981'
              : feedback === 'wrong'
                ? '#EF4444'
                : 'transparent',
          transition: 'color 0.2s',
        }}
      >
        {message || '\u00A0'}
      </div>

      {/* Word class legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px',
          padding: '8px 0',
          flexShrink: 0,
        }}
      >
        {(Object.keys(WORD_CLASS_LABELS) as WordClass[]).map((wc) => {
          const diff = difficultyManager.getDifficulty();
          // Only show relevant classes for current difficulty
          if (diff === 'easy' && !['substantivo', 'verbo'].includes(wc)) return null;
          if (diff === 'medium' && wc === 'advérbio') return null;

          const isTarget = wc === currentQuestion.targetClass;

          return (
            <div
              key={wc}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '10px',
                background: isTarget ? `${WORD_CLASS_COLORS[wc]}15` : '#F9FAFB',
                border: `2px solid ${isTarget ? WORD_CLASS_COLORS[wc] : '#E5E7EB'}`,
                fontSize: '12px',
                fontWeight: isTarget ? 700 : 500,
                color: WORD_CLASS_COLORS[wc],
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: WORD_CLASS_COLORS[wc],
                }}
              />
              {WORD_CLASS_LABELS[wc]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
