import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AppProvider } from './hooks/useAppContext';
import { Header } from './components/Layout/Header';
import { Home } from './components/Layout/Home';
import { GameSelector } from './components/GameSelector/GameSelector';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LoginPage } from './components/Auth/LoginPage';
import { SignupPage } from './components/Auth/SignupPage';
import { LetterMatchGame } from './games/literacy/LetterMatch/LetterMatchGame';
import { SyllablePuzzleGame } from './games/literacy/SyllablePuzzle/SyllablePuzzleGame';
import { WordBuilderGame } from './games/literacy/WordBuilder/WordBuilderGame';
import { NumberSenseGame } from './games/math/NumberSense/NumberSenseGame';
import { CountingAdventureGame } from './games/math/CountingAdventure/CountingAdventureGame';
import { ShapeExplorerGame } from './games/math/ShapeExplorer/ShapeExplorerGame';
import { MemoryCardsGame } from './games/memory/MemoryCards/MemoryCardsGame';
import { SequenceGameGame } from './games/memory/SequenceGame/SequenceGameGame';
import { PathTracerGame } from './games/motor/PathTracer/PathTracerGame';
import { EmotionMatchGame } from './games/social/EmotionMatch/EmotionMatchGame';
// 5º Ano - Matemática
import { MathOperationsGame } from './games/5ano/matematica/MathOperations/MathOperationsGame';
import { FractionLabGame } from './games/5ano/matematica/FractionLab/FractionLabGame';
import { DecimalWorldGame } from './games/5ano/matematica/DecimalWorld/DecimalWorldGame';
// 5º Ano - Português
import { WordClassesGame } from './games/5ano/portugues/WordClasses/WordClassesGame';
import { SpellingChallengeGame } from './games/5ano/portugues/SpellingChallenge/SpellingChallengeGame';
import { TextComprehensionGame } from './games/5ano/portugues/TextComprehension/TextComprehensionGame';
// 5º Ano - Ciências
import { SolarSystemGame } from './games/5ano/ciencias/SolarSystem/SolarSystemGame';
import { HumanBodyGame } from './games/5ano/ciencias/HumanBody/HumanBodyGame';
import { WaterNatureGame } from './games/5ano/ciencias/WaterNature/WaterNatureGame';
// 5º Ano - Geografia e História
import { BrazilRegionsGame } from './games/5ano/geografia-historia/BrazilRegions/BrazilRegionsGame';
import { HistoryTimelineGame } from './games/5ano/geografia-historia/HistoryTimeline/HistoryTimelineGame';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #FFF8F2 0%, #FFF0E8 100%)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div className="animate-float" style={{ fontSize: '3rem', marginBottom: 12 }}>🎮</div>
          <p style={{
            fontFamily: "'Baloo 2', system-ui, sans-serif",
            fontSize: '1.2rem',
            fontWeight: 800,
            color: '#FF6B35',
          }}>
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F2' }}>
        <div className="animate-float" style={{ fontSize: '3rem' }}>🎮</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage />} />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <AuthGuard>
            <AppProvider>
              <div className="h-screen flex flex-col bg-bg">
                <Header />
                <main className="flex-1 overflow-hidden">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/games" element={<GameSelector />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* Educação Infantil */}
                    <Route path="/game/letter-match" element={<LetterMatchGame />} />
                    <Route path="/game/syllable-puzzle" element={<SyllablePuzzleGame />} />
                    <Route path="/game/word-builder" element={<WordBuilderGame />} />
                    <Route path="/game/number-sense" element={<NumberSenseGame />} />
                    <Route path="/game/counting-adventure" element={<CountingAdventureGame />} />
                    <Route path="/game/shape-explorer" element={<ShapeExplorerGame />} />
                    <Route path="/game/memory-cards" element={<MemoryCardsGame />} />
                    <Route path="/game/sequence-game" element={<SequenceGameGame />} />
                    <Route path="/game/path-tracer" element={<PathTracerGame />} />
                    <Route path="/game/emotion-match" element={<EmotionMatchGame />} />
                    {/* 5º Ano - Fundamental I */}
                    <Route path="/game/fraction-lab" element={<FractionLabGame />} />
                    <Route path="/game/math-operations" element={<MathOperationsGame />} />
                    <Route path="/game/decimal-world" element={<DecimalWorldGame />} />
                    <Route path="/game/word-classes" element={<WordClassesGame />} />
                    <Route path="/game/spelling-challenge" element={<SpellingChallengeGame />} />
                    <Route path="/game/text-comprehension" element={<TextComprehensionGame />} />
                    <Route path="/game/solar-system" element={<SolarSystemGame />} />
                    <Route path="/game/human-body" element={<HumanBodyGame />} />
                    <Route path="/game/water-nature" element={<WaterNatureGame />} />
                    <Route path="/game/brazil-regions" element={<BrazilRegionsGame />} />
                    <Route path="/game/history-timeline" element={<HistoryTimelineGame />} />
                  </Routes>
                </main>
              </div>
            </AppProvider>
          </AuthGuard>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
