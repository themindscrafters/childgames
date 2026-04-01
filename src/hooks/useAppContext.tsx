import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Student } from '../data/models';
import { getStudents } from '../data/db';
import { useAuth } from './useAuth';

interface AppContextType {
  currentStudent: Student | null;
  setCurrentStudent: (student: Student | null) => void;
  students: Student[];
  refreshStudents: () => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshStudents = async () => {
    if (!user) {
      setStudents([]);
      setLoading(false);
      return;
    }
    try {
      const list = await getStudents();
      setStudents(list);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshStudents();
  }, [user]);

  useEffect(() => {
    if (currentStudent?.settings) {
      const { font, highContrast } = currentStudent.settings;
      document.body.classList.toggle('font-opendyslexic', font === 'opendyslexic');
      document.body.classList.toggle('high-contrast', highContrast);
    } else {
      document.body.classList.remove('font-opendyslexic', 'high-contrast');
    }
  }, [currentStudent]);

  return (
    <AppContext.Provider
      value={{
        currentStudent,
        setCurrentStudent,
        students,
        refreshStudents,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
