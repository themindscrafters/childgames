import { supabase } from './supabase';
import type { Student, GameSession } from './models';

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
      difficulties: student.difficulties,
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
  if (changes.difficulties !== undefined) update.difficulties = changes.difficulties;
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

// --- Invites ---

export async function createInvite(studentId: number): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
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

  // Create relation
  await supabase.from('user_students').insert({
    user_id: user.id,
    student_id: invite.student_id,
  });

  // Mark invite as used
  await supabase.from('invites').update({
    used_by: user.id,
    used_at: new Date().toISOString(),
  }).eq('id', invite.id);

  return { studentName: (invite as any).students?.name ?? 'Criança' };
}

// --- Helpers ---

function mapStudent(row: any): Student {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    difficulties: row.difficulties ?? [],
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
