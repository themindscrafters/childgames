import { supabase } from './supabase';
import type { Student, GameSession, AdminStats, AdminFeedback } from './models';

export async function getStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name');
  if (error) throw error;
  return (data ?? []).map(mapStudent);
}

export async function getStudent(id: number): Promise<Student | undefined> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return undefined;
  return mapStudent(data);
}

export async function addStudent(student: Omit<Student, 'id'>): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('students')
    .insert({
      name: student.name,
      avatar: student.avatar,
      current_difficulty: student.current_difficulty,
      settings: student.settings,
      created_by: user.id,
    })
    .select('id')
    .single();
  if (error) throw error;

  // Create user_students relation
  await supabase.from('user_students').insert({
    user_id: user.id,
    student_id: data.id,
  });

  return data.id;
}

export async function updateStudent(id: number, changes: Partial<Student>): Promise<void> {
  const update: Record<string, unknown> = {};
  if (changes.name !== undefined) update.name = changes.name;
  if (changes.avatar !== undefined) update.avatar = changes.avatar;
  if (changes.current_difficulty !== undefined) update.current_difficulty = changes.current_difficulty;
  if (changes.settings !== undefined) update.settings = changes.settings;

  const { error } = await supabase
    .from('students')
    .update(update)
    .eq('id', id);
  if (error) throw error;
}

export async function deleteStudent(id: number): Promise<void> {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function saveSession(session: Omit<GameSession, 'id'>): Promise<number> {
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({
      student_id: session.student_id,
      game_id: session.game_id,
      started_at: session.started_at,
      ended_at: session.ended_at,
      difficulty: session.difficulty,
      score: session.score,
      total_questions: session.total_questions,
      correct_answers: session.correct_answers,
      attempts: session.attempts,
      hints_used: session.hints_used,
      completed: session.completed,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function getStudentSessions(studentId: number, gameId?: string): Promise<GameSession[]> {
  let query = supabase
    .from('game_sessions')
    .select('*')
    .eq('student_id', studentId)
    .order('started_at', { ascending: false });

  if (gameId) {
    query = query.eq('game_id', gameId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getRecentSessions(studentId: number, limit = 10): Promise<GameSession[]> {
  const { data, error } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('student_id', studentId)
    .order('started_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

// --- Dashboard Analytics ---

export async function getDailyStats(studentId: number, date?: string): Promise<{
  sessions: number; correct: number; total: number; accuracy: number; totalMinutes: number;
}> {
  const day = date ?? new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('student_id', studentId)
    .gte('started_at', `${day}T00:00:00`)
    .lt('started_at', `${day}T23:59:59`);
  if (error) throw error;
  const rows = data ?? [];
  const correct = rows.reduce((s, r) => s + r.correct_answers, 0);
  const total = rows.reduce((s, r) => s + r.total_questions, 0);
  let totalMinutes = 0;
  for (const r of rows) {
    if (r.ended_at && r.started_at) {
      totalMinutes += (new Date(r.ended_at).getTime() - new Date(r.started_at).getTime()) / 60000;
    }
  }
  return {
    sessions: rows.length,
    correct,
    total,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    totalMinutes: Math.round(totalMinutes),
  };
}

export async function getWeeklyStats(studentId: number): Promise<{
  days: { date: string; accuracy: number; sessions: number; minutes: number }[];
  trend: number;
}> {
  const now = new Date();
  const days: { date: string; accuracy: number; sessions: number; minutes: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const stats = await getDailyStats(studentId, dateStr);
    days.push({ date: dateStr, accuracy: stats.accuracy, sessions: stats.sessions, minutes: stats.totalMinutes });
  }

  // Trend: compare this week avg vs last week
  const thisWeekAvg = days.filter(d => d.sessions > 0).reduce((s, d) => s + d.accuracy, 0) /
    (days.filter(d => d.sessions > 0).length || 1);

  const lastWeekDays: number[] = [];
  for (let i = 13; i >= 7; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const stats = await getDailyStats(studentId, d.toISOString().split('T')[0]);
    if (stats.sessions > 0) lastWeekDays.push(stats.accuracy);
  }
  const lastWeekAvg = lastWeekDays.length > 0
    ? lastWeekDays.reduce((s, v) => s + v, 0) / lastWeekDays.length
    : thisWeekAvg;

  return { days, trend: Math.round(thisWeekAvg - lastWeekAvg) };
}

export async function calculateStreak(studentId: number): Promise<number> {
  const { data, error } = await supabase
    .from('game_sessions')
    .select('started_at')
    .eq('student_id', studentId)
    .order('started_at', { ascending: false });
  if (error || !data?.length) return 0;

  const uniqueDates = [...new Set(data.map(r => new Date(r.started_at).toISOString().split('T')[0]))].sort().reverse();

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Streak starts from today or yesterday
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

  let expected = uniqueDates[0] === today ? today : yesterday;
  for (const date of uniqueDates) {
    if (date === expected) {
      streak++;
      const prev = new Date(expected);
      prev.setDate(prev.getDate() - 1);
      expected = prev.toISOString().split('T')[0];
    } else {
      break;
    }
  }
  return streak;
}

export async function getSkillStats(studentId: number): Promise<{
  category: string; label: string; emoji: string; accuracy: number; sessions: number; trend: number;
}[]> {
  const { data, error } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('student_id', studentId)
    .order('started_at', { ascending: false });
  if (error) throw error;

  const CATEGORIES: Record<string, { label: string; emoji: string; games: string[] }> = {
    literacy: { label: 'Alfabetização', emoji: '📖', games: ['letter-match', 'syllable-puzzle', 'word-builder'] },
    math: { label: 'Matemática', emoji: '🔢', games: ['number-sense', 'counting-adventure', 'shape-explorer', 'fraction-lab', 'math-operations', 'decimal-world'] },
    memory: { label: 'Memória', emoji: '🧠', games: ['memory-cards', 'sequence-game'] },
    motor: { label: 'Coordenação', emoji: '✍️', games: ['path-tracer'] },
    social: { label: 'Social', emoji: '😊', games: ['emotion-match'] },
    portugues: { label: 'Português', emoji: '📝', games: ['word-classes', 'spelling-challenge', 'text-comprehension'] },
    ciencias: { label: 'Ciências', emoji: '🔬', games: ['solar-system', 'human-body', 'water-nature'] },
    geo: { label: 'Geografia/História', emoji: '🌎', games: ['brazil-regions', 'history-timeline'] },
  };

  const rows = data ?? [];
  const twoWeeksAgo = Date.now() - 14 * 86400000;

  return Object.entries(CATEGORIES).map(([cat, info]) => {
    const catSessions = rows.filter(r => info.games.includes(r.game_id));
    const recent = catSessions.slice(0, 10);
    const older = catSessions.filter(r => new Date(r.started_at).getTime() < twoWeeksAgo).slice(0, 10);

    const recentAcc = recent.length > 0
      ? Math.round(recent.reduce((s, r) => s + (r.total_questions > 0 ? r.correct_answers / r.total_questions : 0), 0) / recent.length * 100)
      : 0;
    const olderAcc = older.length > 0
      ? Math.round(older.reduce((s, r) => s + (r.total_questions > 0 ? r.correct_answers / r.total_questions : 0), 0) / older.length * 100)
      : recentAcc;

    return {
      category: cat,
      label: info.label,
      emoji: info.emoji,
      accuracy: recentAcc,
      sessions: catSessions.length,
      trend: recentAcc - olderAcc,
    };
  }).filter(s => s.sessions > 0);
}

export function generatePositiveMessage(
  weeklyTrend: number,
  streak: number,
  todaySessions: number,
  bestCategory?: { label: string; trend: number }
): string {
  if (streak >= 7) return `Jogou todos os dias esta semana — consistência incrível! 💪`;
  if (streak >= 3) return `🔥 ${streak} dias seguidos jogando! Continue assim!`;
  if (weeklyTrend > 20) return `Melhorou ${weeklyTrend}% esta semana! Progresso incrível! 🎉`;
  if (weeklyTrend > 5 && bestCategory) return `Evoluindo em ${bestCategory.label}! ↑${bestCategory.trend}% 📈`;
  if (todaySessions >= 3) return `Já completou ${todaySessions} jogos hoje! Mandou bem! ⭐`;
  if (todaySessions > 0) return `Boa sessão hoje! Cada jogo conta pra evolução 🌟`;
  if (weeklyTrend < -10) return `Continue praticando, cada dia conta! 💙`;
  return `Vamos jogar? A prática leva à evolução! 🚀`;
}

// --- Invites ---

export async function createInvite(studentId: number): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  const code = Array.from(array, b => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32]).join('');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error } = await supabase.from('invites').insert({
    code,
    student_id: studentId,
    created_by: user.id,
    expires_at: expiresAt.toISOString(),
  });
  if (error) throw error;
  return code;
}

export async function redeemInvite(code: string): Promise<{ studentName: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Find valid invite
  const { data: invite, error: findError } = await supabase
    .from('invites')
    .select('*, students(name)')
    .eq('code', code.toUpperCase())
    .is('used_by', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (findError || !invite) throw new Error('Código inválido ou expirado');

  // Check if user already has access to this student
  const { data: existing } = await supabase
    .from('user_students')
    .select('id')
    .eq('user_id', user.id)
    .eq('student_id', invite.student_id)
    .maybeSingle();

  if (existing) throw new Error('Você já tem acesso a esta criança');

  // Mark invite as used first (prevents race condition — if two requests hit simultaneously,
  // only one will match the .is('used_by', null) condition above)
  const { error: updateError } = await supabase.from('invites').update({
    used_by: user.id,
    used_at: new Date().toISOString(),
  }).eq('id', invite.id).is('used_by', null);

  if (updateError) throw new Error('Código já foi utilizado');

  // Create relation
  await supabase.from('user_students').insert({
    user_id: user.id,
    student_id: invite.student_id,
  });

  return { studentName: (invite as any).students?.name ?? 'Criança' };
}

// --- PIN (server-side hashed) ---

export async function setPin(pin: string): Promise<void> {
  const { error } = await supabase.rpc('set_pin', { pin_input: pin });
  if (error) throw new Error(error.message);
}

export async function verifyPin(pin: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('verify_pin', { pin_input: pin });
  if (error) throw new Error(error.message);
  return data === true;
}

// --- Feedback ---

export async function sendFeedback(rating: number, message: string, page: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('feedback').insert({
    user_id: user.id,
    rating,
    message: message.trim() || null,
    page,
  });
  if (error) throw new Error(error.message);
}

// --- Admin ---

export async function getAdminFeedback(): Promise<AdminFeedback> {
  const { data, error } = await supabase.rpc('get_admin_feedback');
  if (error) throw new Error(error.message);
  return data as AdminFeedback;
}

export async function getAdminStats(): Promise<AdminStats> {
  const { data, error } = await supabase.rpc('get_admin_stats');
  if (error) throw new Error(error.message);
  return data as AdminStats;
}

// --- Helpers ---

function mapStudent(row: any): Student {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    current_difficulty: row.current_difficulty ?? 'easy',
    created_at: row.created_at,
    created_by: row.created_by,
    settings: row.settings ?? {
      font: 'lexend',
      highContrast: false,
      soundEnabled: true,
      musicEnabled: true,
      narrationEnabled: true,
      animationSpeed: 'normal',
      enabledGames: [],
    },
  };
}
