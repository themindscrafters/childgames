import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../shared/DifficultyManager';
import { RewardSystem } from '../../shared/RewardSystem';
import { audioManager } from '../../shared/AudioManager';
import { saveSession } from '../../../data/db';
import { useApp } from '../../../hooks/useAppContext';
import { GameComplete } from '../../../components/GameSelector/GameComplete';
import type { Difficulty } from '../../../data/models';

interface PathPoint {
  x: number;
  y: number;
}

interface PathDef {
  name: string;
  label: string;
  points: (w: number, h: number) => PathPoint[];
}

const PATHS_EASY: PathDef[] = [
  {
    name: 'line-h',
    label: 'Linha',
    points: (w, h) => {
      const pts: PathPoint[] = [];
      for (let i = 0; i <= 40; i++) {
        pts.push({ x: w * 0.15 + (w * 0.7 * i) / 40, y: h * 0.5 });
      }
      return pts;
    },
  },
  {
    name: 'line-v',
    label: 'Linha vertical',
    points: (w, h) => {
      const pts: PathPoint[] = [];
      for (let i = 0; i <= 40; i++) {
        pts.push({ x: w * 0.5, y: h * 0.15 + (h * 0.7 * i) / 40 });
      }
      return pts;
    },
  },
  {
    name: 'line-diag',
    label: 'Diagonal',
    points: (w, h) => {
      const pts: PathPoint[] = [];
      for (let i = 0; i <= 40; i++) {
        pts.push({
          x: w * 0.15 + (w * 0.7 * i) / 40,
          y: h * 0.15 + (h * 0.7 * i) / 40,
        });
      }
      return pts;
    },
  },
];

const PATHS_MEDIUM: PathDef[] = [
  {
    name: 'circle',
    label: 'Circulo',
    points: (w, h) => {
      const pts: PathPoint[] = [];
      const cx = w * 0.5;
      const cy = h * 0.5;
      const r = Math.min(w, h) * 0.3;
      for (let i = 0; i <= 60; i++) {
        const angle = (Math.PI * 2 * i) / 60 - Math.PI / 2;
        pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
      }
      return pts;
    },
  },
  {
    name: 'zigzag',
    label: 'Zigue-zague',
    points: (w, h) => {
      const pts: PathPoint[] = [];
      const segments = 4;
      for (let s = 0; s < segments; s++) {
        const startX = w * 0.1 + (w * 0.8 * s) / segments;
        const endX = w * 0.1 + (w * 0.8 * (s + 1)) / segments;
        const startY = s % 2 === 0 ? h * 0.25 : h * 0.75;
        const endY = s % 2 === 0 ? h * 0.75 : h * 0.25;
        for (let i = 0; i <= 15; i++) {
          const t = i / 15;
          pts.push({
            x: startX + (endX - startX) * t,
            y: startY + (endY - startY) * t,
          });
        }
      }
      return pts;
    },
  },
  {
    name: 'wave',
    label: 'Onda',
    points: (w, h) => {
      const pts: PathPoint[] = [];
      for (let i = 0; i <= 60; i++) {
        const t = i / 60;
        pts.push({
          x: w * 0.1 + w * 0.8 * t,
          y: h * 0.5 + Math.sin(t * Math.PI * 3) * h * 0.2,
        });
      }
      return pts;
    },
  },
];

const PATHS_HARD: PathDef[] = [
  {
    name: 'letter-A',
    label: 'Letra A',
    points: (w, h) => {
      const pts: PathPoint[] = [];
      const cx = w * 0.5;
      const top = h * 0.15;
      const bot = h * 0.85;
      const half = h * 0.55;
      // left leg
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        pts.push({ x: cx - (cx - w * 0.2) * (1 - t), y: top + (bot - top) * t });
      }
      // crossbar (go to mid-right)
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const leftX = w * 0.2 + (cx - w * 0.2) * ((half - top) / (bot - top));
        const rightX = w * 0.8 - (w * 0.8 - cx) * ((half - top) / (bot - top));
        pts.push({ x: leftX + (rightX - leftX) * t, y: half });
      }
      // right leg upward then down
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        pts.push({ x: cx + (w * 0.8 - cx) * t, y: top + (bot - top) * t });
      }
      return pts;
    },
  },
  {
    name: 'letter-B',
    label: 'Letra B',
    points: (w, h) => {
      const pts: PathPoint[] = [];
      const left = w * 0.3;
      const top = h * 0.15;
      const bot = h * 0.85;
      const mid = h * 0.5;
      // vertical line down
      for (let i = 0; i <= 15; i++) {
        pts.push({ x: left, y: top + (bot - top) * (i / 15) });
      }
      // top bump
      for (let i = 0; i <= 15; i++) {
        const angle = -Math.PI / 2 + (Math.PI * i) / 15;
        const r = (mid - top) / 2;
        pts.push({ x: left + Math.cos(angle) * r * 1.5, y: (top + mid) / 2 + Math.sin(angle) * r });
      }
      // bottom bump
      for (let i = 0; i <= 15; i++) {
        const angle = -Math.PI / 2 + (Math.PI * i) / 15;
        const r = (bot - mid) / 2;
        pts.push({ x: left + Math.cos(angle) * r * 1.5, y: (mid + bot) / 2 + Math.sin(angle) * r });
      }
      return pts;
    },
  },
  {
    name: 'letter-C',
    label: 'Letra C',
    points: (w, h) => {
      const pts: PathPoint[] = [];
      const cx = w * 0.5;
      const cy = h * 0.5;
      const rx = w * 0.25;
      const ry = h * 0.3;
      for (let i = 0; i <= 40; i++) {
        const angle = -Math.PI * 0.3 + (Math.PI * 1.6 * i) / 40;
        pts.push({ x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry });
      }
      return pts;
    },
  },
];

const PATHS_BY_DIFFICULTY: Record<Difficulty, PathDef[]> = {
  easy: PATHS_EASY,
  medium: PATHS_MEDIUM,
  hard: PATHS_HARD,
};

const THICKNESS: Record<Difficulty, number> = {
  easy: 20,
  medium: 12,
  hard: 8,
};

const TOLERANCE: Record<Difficulty, number> = {
  easy: 40,
  medium: 28,
  hard: 20,
};

export function PathTracerGame() {
  const { currentStudent } = useApp();
  const difficultyRef = useRef(new DifficultyManager(currentStudent?.currentDifficulty ?? 'easy'));
  const rewardRef = useRef(new RewardSystem());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [, setDifficulty] = useState<Difficulty>(difficultyRef.current.getDifficulty());
  const [score, setScore] = useState(0);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [traceProgress, setTraceProgress] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [isTracing, setIsTracing] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [totalRounds, setTotalRounds] = useState(3);
  const [attempts, setAttempts] = useState(0);

  const pathPointsRef = useRef<PathPoint[]>([]);
  const visitedRef = useRef<boolean[]>([]);
  const trailRef = useRef<PathPoint[]>([]);
  const startTimeRef = useRef(new Date());
  const canvasSizeRef = useRef({ w: 0, h: 0 });

  const drawPath = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = canvasSizeRef.current;
    ctx.clearRect(0, 0, w, h);

    const points = pathPointsRef.current;
    const trail = trailRef.current;
    const thickness = THICKNESS[difficultyRef.current.getDifficulty()];

    // Draw dotted guide path
    ctx.save();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = thickness;
    ctx.setLineDash([thickness * 0.6, thickness * 0.8]);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    ctx.stroke();
    ctx.restore();

    // Draw green trail
    if (trail.length > 1) {
      ctx.save();
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = thickness + 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([]);
      ctx.shadowColor = '#22C55E';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Draw start and end markers
    if (points.length > 0) {
      // Start
      ctx.save();
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, thickness * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.round(thickness * 0.8)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('S', points[0].x, points[0].y);
      ctx.restore();

      // End
      const last = points[points.length - 1];
      ctx.save();
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(last.x, last.y, thickness * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.round(thickness * 0.8)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('F', last.x, last.y);
      ctx.restore();
    }
  }, []);

  const setupRound = useCallback(() => {
    const diff = difficultyRef.current.getDifficulty();
    const paths = PATHS_BY_DIFFICULTY[diff];
    const pathDef = paths[currentPathIndex % paths.length];
    const { w, h } = canvasSizeRef.current;

    if (w === 0 || h === 0) return;

    const points = pathDef.points(w, h);
    pathPointsRef.current = points;
    visitedRef.current = new Array(points.length).fill(false);
    trailRef.current = [];
    setTraceProgress(0);
    setIsTracing(false);
    setMessage(`Trace: ${pathDef.label}`);
    drawPath();
    audioManager.speak(`Trace o ${pathDef.label} com o dedo!`);
  }, [currentPathIndex, drawPath]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    canvasSizeRef.current = { w: rect.width, h: rect.height };
  }, []);

  const initGame = useCallback(() => {
    const diff = difficultyRef.current.getDifficulty();
    const paths = PATHS_BY_DIFFICULTY[diff];
    setDifficulty(diff);
    setScore(0);
    setCurrentPathIndex(0);
    setRoundsCompleted(0);
    setTotalRounds(paths.length);
    setGameComplete(false);
    setMessage('');
    setAttempts(0);
    rewardRef.current.reset();
    startTimeRef.current = new Date();
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    resizeCanvas();
    const handleResize = () => {
      resizeCanvas();
      setupRound();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas, setupRound]);

  useEffect(() => {
    if (canvasSizeRef.current.w > 0) {
      setupRound();
    }
  }, [setupRound, currentPathIndex]);

  const getCanvasPos = useCallback(
    (clientX: number, clientY: number): PathPoint => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    []
  );

  const checkProximity = useCallback(
    (pos: PathPoint) => {
      const points = pathPointsRef.current;
      const visited = visitedRef.current;
      const tolerance = TOLERANCE[difficultyRef.current.getDifficulty()];
      let newVisits = 0;

      for (let i = 0; i < points.length; i++) {
        if (visited[i]) continue;
        const dx = pos.x - points[i].x;
        const dy = pos.y - points[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= tolerance) {
          visited[i] = true;
          newVisits++;
        }
      }

      if (newVisits > 0) {
        trailRef.current.push(pos);
        const visitedCount = visited.filter(Boolean).length;
        const progress = Math.round((visitedCount / points.length) * 100);
        setTraceProgress(progress);
        drawPath();

        if (progress >= 90) {
          // Round complete
          setAttempts((a) => a + 1);
          const reward = rewardRef.current.recordCorrect();
          difficultyRef.current.recordAnswer(true);
          setScore((s) => s + Math.round(progress / 10) * 10);
          setMessage(reward.message);
          audioManager.playCorrect();
          setIsTracing(false);

          const newRounds = roundsCompleted + 1;
          setRoundsCompleted(newRounds);

          if (newRounds >= totalRounds) {
            setTimeout(async () => {
              setGameComplete(true);
              if (currentStudent?.id) {
                await saveSession({
                  studentId: currentStudent.id,
                  gameId: 'path-tracer',
                  startedAt: startTimeRef.current,
                  endedAt: new Date(),
                  difficulty: difficultyRef.current.getDifficulty(),
                  score: score + Math.round(progress / 10) * 10,
                  totalQuestions: totalRounds,
                  correctAnswers: newRounds,
                  attempts: attempts + 1,
                  hintsUsed: 0,
                  completed: true,
                });
              }
            }, 800);
          } else {
            setTimeout(() => {
              setCurrentPathIndex((i) => i + 1);
            }, 1200);
          }
        }
      }
    },
    [drawPath, roundsCompleted, totalRounds, currentStudent, score, attempts]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (gameComplete) return;
      e.preventDefault();
      setIsTracing(true);
      const pos = getCanvasPos(e.clientX, e.clientY);
      trailRef.current = [pos];
      checkProximity(pos);
    },
    [gameComplete, getCanvasPos, checkProximity]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isTracing || gameComplete) return;
      e.preventDefault();
      const pos = getCanvasPos(e.clientX, e.clientY);
      checkProximity(pos);
    },
    [isTracing, gameComplete, getCanvasPos, checkProximity]
  );

  const handlePointerUp = useCallback(() => {
    setIsTracing(false);
  }, []);

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardRef.current.getState()}
        gameName="Tracar Caminhos"
        onPlayAgain={() => {
          initGame();
          setTimeout(() => setupRound(), 100);
        }}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Tracar Caminhos</h2>
        <div style={styles.statsRow}>
          <span style={styles.stat}>⭐ {score}</span>
          <span style={styles.stat}>
            {roundsCompleted}/{totalRounds}
          </span>
          <span style={styles.diffBadge}>{difficultyRef.current.getConfig().label}</span>
        </div>
      </div>

      {message && (
        <div style={styles.messageBar} key={message + Date.now()}>
          {message}
        </div>
      )}

      <div style={styles.progressRow}>
        <div style={styles.progressBarOuter}>
          <div
            style={{
              ...styles.progressBarInner,
              width: `${traceProgress}%`,
            }}
          />
        </div>
        <span style={styles.progressLabel}>{traceProgress}%</span>
      </div>

      <div ref={containerRef} style={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          style={styles.canvas}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>

      <style>{`
        @keyframes fadeInMsg {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
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
    gap: '10px',
    background: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 50%, #F9A8D4 100%)',
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
    background: '#EC4899',
    borderRadius: '12px',
    padding: '2px 12px',
  },
  messageBar: {
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#EC4899',
    animation: 'fadeInMsg 0.3s ease',
  },
  progressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  progressBarOuter: {
    flex: 1,
    height: '10px',
    borderRadius: '5px',
    background: '#FBCFE8',
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    background: 'linear-gradient(90deg, #EC4899, #DB2777)',
    borderRadius: '5px',
    transition: 'width 0.3s ease',
  },
  progressLabel: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#9D174D',
    minWidth: '40px',
    textAlign: 'right',
  },
  canvasContainer: {
    maxHeight: '60vh',
    borderRadius: '20px',
    background: '#fff',
    boxShadow: '0 4px 20px rgba(236, 72, 153, 0.15)',
    overflow: 'hidden',
    touchAction: 'none',
    position: 'relative',
  },
  canvas: {
    display: 'block',
    width: '100%',
    height: '100%',
    cursor: 'crosshair',
    touchAction: 'none',
  },
};
