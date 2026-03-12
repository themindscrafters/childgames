import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../../shared/DifficultyManager';
import { RewardSystem } from '../../../shared/RewardSystem';
import { audioManager } from '../../../shared/AudioManager';
import { saveSession } from '../../../../data/db';
import { useApp } from '../../../../hooks/useAppContext';
import { GameComplete } from '../../../../components/GameSelector/GameComplete';
import { REGIONS, generateQuestions } from './regionsData';
import type { RegionQuestion } from './regionsData';

const TOTAL_ROUNDS = 10;
const THEME_COLOR = '#06B6D4';
const THEME_LIGHT = '#ECFEFF';
const THEME_BORDER = '#A5F3FC';

export function BrazilRegionsGame() {
  const { currentStudent } = useApp();
  const difficultyManager = useRef(
    new DifficultyManager(currentStudent?.currentDifficulty ?? 'easy')
  ).current;
  const rewardSystem = useRef(new RewardSystem()).current;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [questions, setQuestions] = useState<RegionQuestion[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [highlightedRegion, setHighlightedRegion] = useState<string | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const startTime = useRef(new Date());

  const generateNewQuestions = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const newQuestions = generateQuestions(diff, TOTAL_ROUNDS);
    setQuestions(newQuestions);
  }, [difficultyManager]);

  useEffect(() => {
    generateNewQuestions();
  }, []);

  useEffect(() => {
    setOptionsVisible(false);
    const timer = setTimeout(() => setOptionsVisible(true), 200);
    return () => clearTimeout(timer);
  }, [round]);

  const currentQuestion = questions[round];

  const handleSelect = useCallback(
    (option: string) => {
      if (feedback !== null || !currentQuestion) return;

      setSelectedOption(option);
      setAttempts((a) => a + 1);

      // Highlight region if answer is a region name
      const regionNames: string[] = REGIONS.map((r) => r.name);
      if (regionNames.includes(option)) {
        setHighlightedRegion(option);
      } else if (regionNames.includes(currentQuestion.correct)) {
        setHighlightedRegion(currentQuestion.correct);
      }

      if (option === currentQuestion.correct) {
        setFeedback('correct');
        setScore((s) => s + 1);
        const rewardState = rewardSystem.recordCorrect();
        const { changed } = difficultyManager.recordAnswer(true);
        setMessage(rewardState.message);
        audioManager.playCorrect();

        setTimeout(() => {
          const nextRound = round + 1;
          if (nextRound >= TOTAL_ROUNDS) {
            finishGame(score + 1);
          } else {
            setRound(nextRound);
            setFeedback(null);
            setSelectedOption(null);
            setHighlightedRegion(null);
            setMessage('');
            // Regenerate questions if difficulty changed
            if (changed) {
              const diff = difficultyManager.getDifficulty();
              const newQ = generateQuestions(diff, TOTAL_ROUNDS - nextRound);
              setQuestions((prev) => [...prev.slice(0, nextRound), ...newQ]);
            }
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
          setSelectedOption(null);
          setHighlightedRegion(null);
          setMessage('');
        }, 1200);
      }
    },
    [feedback, currentQuestion, round, score, rewardSystem, difficultyManager]
  );

  const finishGame = useCallback(
    async (finalScore: number) => {
      setGameComplete(true);
      if (currentStudent?.id) {
        await saveSession({
          studentId: currentStudent.id,
          gameId: 'brazil-regions',
          startedAt: startTime.current,
          endedAt: new Date(),
          difficulty: difficultyManager.getDifficulty(),
          score: finalScore,
          totalQuestions: TOTAL_ROUNDS,
          correctAnswers: finalScore,
          attempts,
          hintsUsed,
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
    setFeedback(null);
    setSelectedOption(null);
    setHighlightedRegion(null);
    setMessage('');
    startTime.current = new Date();
    generateNewQuestions();
  }, [difficultyManager, rewardSystem, generateNewQuestions]);

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardSystem.getState()}
        gameName="Regioes do Brasil"
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (!currentQuestion) return null;

  const diffLabel: Record<string, string> = {
    easy: 'Facil',
    medium: 'Medio',
    hard: 'Dificil',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        padding: '12px 16px',
        gap: '10px',
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
          <span style={{ fontSize: '24px' }}>{'\uD83D\uDDFA\uFE0F'}</span>
          <span style={{ fontWeight: 'bold', fontSize: '16px', color: THEME_COLOR }}>
            Regioes do Brasil
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              background: THEME_LIGHT,
              borderRadius: '16px',
              padding: '3px 10px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0E7490',
            }}
          >
            {diffLabel[difficultyManager.getDifficulty()]}
          </span>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>
            {round + 1}/{TOTAL_ROUNDS}
          </span>
          <span style={{ fontSize: '18px' }}>{'\u2B50'} {score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          height: '8px',
          background: '#E5E7EB',
          borderRadius: '8px',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(round / TOTAL_ROUNDS) * 100}%`,
            background: `linear-gradient(90deg, ${THEME_COLOR}, #0891B2)`,
            borderRadius: '8px',
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {/* Streak indicator */}
      {rewardSystem.getState().streak >= 2 && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#F59E0B',
            fontWeight: 'bold',
            flexShrink: 0,
          }}
        >
          {'\uD83D\uDD25'} {rewardSystem.getState().streak} seguidos!
        </div>
      )}

      {/* Brazil Region Map Visual */}
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: 'auto auto auto',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        {/* Row 1: Norte spans full width */}
        <div
          style={{
            gridColumn: '1 / 4',
            background: highlightedRegion === 'Norte'
              ? REGIONS[0].color
              : `${REGIONS[0].color}30`,
            border: `2px solid ${REGIONS[0].color}`,
            borderRadius: '12px',
            padding: '8px 12px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            transform: highlightedRegion === 'Norte' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: highlightedRegion === 'Norte' ? '#fff' : REGIONS[0].color,
          }}>
            {REGIONS[0].emoji} Norte
          </div>
        </div>

        {/* Row 2: Nordeste (right side, 2 cols) + Centro-Oeste (left side, 1 col) */}
        <div
          style={{
            gridColumn: '1 / 2',
            gridRow: '2 / 4',
            background: highlightedRegion === 'Centro-Oeste'
              ? REGIONS[2].color
              : `${REGIONS[2].color}30`,
            border: `2px solid ${REGIONS[2].color}`,
            borderRadius: '12px',
            padding: '8px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            transform: highlightedRegion === 'Centro-Oeste' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: highlightedRegion === 'Centro-Oeste' ? '#fff' : REGIONS[2].color,
          }}>
            {REGIONS[2].emoji} Centro-Oeste
          </div>
        </div>

        <div
          style={{
            gridColumn: '2 / 4',
            background: highlightedRegion === 'Nordeste'
              ? REGIONS[1].color
              : `${REGIONS[1].color}30`,
            border: `2px solid ${REGIONS[1].color}`,
            borderRadius: '12px',
            padding: '8px 12px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            transform: highlightedRegion === 'Nordeste' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: highlightedRegion === 'Nordeste' ? '#fff' : REGIONS[1].color,
          }}>
            {REGIONS[1].emoji} Nordeste
          </div>
        </div>

        {/* Row 3: Sudeste + Sul */}
        <div
          style={{
            background: highlightedRegion === 'Sudeste'
              ? REGIONS[3].color
              : `${REGIONS[3].color}30`,
            border: `2px solid ${REGIONS[3].color}`,
            borderRadius: '12px',
            padding: '8px 12px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            transform: highlightedRegion === 'Sudeste' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: highlightedRegion === 'Sudeste' ? '#fff' : REGIONS[3].color,
          }}>
            {REGIONS[3].emoji} Sudeste
          </div>
        </div>

        <div
          style={{
            background: highlightedRegion === 'Sul'
              ? REGIONS[4].color
              : `${REGIONS[4].color}30`,
            border: `2px solid ${REGIONS[4].color}`,
            borderRadius: '12px',
            padding: '8px 12px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            transform: highlightedRegion === 'Sul' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: highlightedRegion === 'Sul' ? '#fff' : REGIONS[4].color,
          }}>
            {REGIONS[4].emoji} Sul
          </div>
        </div>
      </div>

      {/* Question */}
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          background: `linear-gradient(135deg, ${THEME_LIGHT}, #F0F9FF)`,
          borderRadius: '16px',
          border: `2px solid ${THEME_BORDER}`,
          padding: '14px 18px',
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '16px', fontWeight: 600, color: '#0E7490', lineHeight: 1.4 }}>
          {currentQuestion.question}
        </span>
      </div>

      {/* Feedback */}
      <div
        style={{
          textAlign: 'center',
          minHeight: '28px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: feedback === 'correct' ? '#10B981' : feedback === 'wrong' ? '#EF4444' : 'transparent',
          transition: 'color 0.2s',
          flexShrink: 0,
        }}
      >
        {message || '\u00A0'}
      </div>

      {/* Options */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          width: '100%',
          maxWidth: '600px',
          paddingBottom: '16px',
          flexShrink: 0,
        }}
      >
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrectAnswer = feedback === 'correct' && option === currentQuestion.correct;
          const isWrongAnswer = feedback === 'wrong' && isSelected;
          const showCorrect = feedback === 'wrong' && option === currentQuestion.correct;

          let bgColor = '#FFFFFF';
          let borderColor = '#D1D5DB';
          let textColor = '#1F2937';

          if (isCorrectAnswer || showCorrect) {
            bgColor = '#D1FAE5';
            borderColor = '#10B981';
            textColor = '#065F46';
          } else if (isWrongAnswer) {
            bgColor = '#FEE2E2';
            borderColor = '#EF4444';
            textColor = '#991B1B';
          }

          return (
            <button
              key={`${round}-${idx}`}
              onClick={() => handleSelect(option)}
              disabled={feedback !== null}
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                border: `3px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: "'Baloo 2', system-ui, sans-serif",
                cursor: feedback !== null ? 'default' : 'pointer',
                transition: 'all 0.2s',
                transform: optionsVisible
                  ? isCorrectAnswer
                    ? 'scale(1.05)'
                    : isWrongAnswer
                      ? 'translateX(4px)'
                      : 'scale(1)'
                  : 'scale(0.8)',
                opacity: optionsVisible ? 1 : 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                minHeight: '48px',
                wordBreak: 'break-word' as const,
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
