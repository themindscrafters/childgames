import Dexie, { type Table } from 'dexie';
import type { Student, GameSession } from './models';

class JogosDB extends Dexie {
  students!: Table<Student, number>;
  sessions!: Table<GameSession, number>;

  constructor() {
    super('jogos-infantis');
    this.version(1).stores({
      students: '++id, name, createdAt',
      sessions: '++id, studentId, gameId, startedAt, completed',
    });
  }
}

export const db = new JogosDB();

export async function getStudents(): Promise<Student[]> {
  return db.students.orderBy('name').toArray();
}

export async function getStudent(id: number): Promise<Student | undefined> {
  return db.students.get(id);
}

export async function addStudent(student: Omit<Student, 'id'>): Promise<number> {
  return db.students.add(student as Student);
}

export async function updateStudent(id: number, changes: Partial<Student>): Promise<void> {
  await db.students.update(id, changes);
}

export async function deleteStudent(id: number): Promise<void> {
  await db.transaction('rw', db.students, db.sessions, async () => {
    await db.sessions.where('studentId').equals(id).delete();
    await db.students.delete(id);
  });
}

export async function saveSession(session: Omit<GameSession, 'id'>): Promise<number> {
  return db.sessions.add(session as GameSession);
}

export async function getStudentSessions(studentId: number, gameId?: string): Promise<GameSession[]> {
  let collection = db.sessions.where('studentId').equals(studentId);
  const sessions = await collection.toArray();
  if (gameId) {
    return sessions.filter((s) => s.gameId === gameId);
  }
  return sessions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export async function getRecentSessions(studentId: number, limit = 10): Promise<GameSession[]> {
  const sessions = await db.sessions
    .where('studentId')
    .equals(studentId)
    .toArray();
  return sessions
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, limit);
}
