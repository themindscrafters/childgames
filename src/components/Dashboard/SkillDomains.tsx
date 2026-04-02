import { useState, useEffect } from 'react';
import { getSkillStats } from '../../data/db';

interface Props {
  studentId: number;
}

const SKILL_COLORS: Record<string, { bar: string; bg: string; border: string }> = {
  literacy: { bar: '#6366F1', bg: '#F3EEFF', border: '#D0C4F0' },
  math: { bar: '#10B981', bg: '#E8FFF5', border: '#B3F0E0' },
  memory: { bar: '#F59E0B', bg: '#FFF8E1', border: '#FFE58A' },
  motor: { bar: '#EC4899', bg: '#FFF0F6', border: '#FFBCDC' },
  social: { bar: '#F472B6', bg: '#FFF0F6', border: '#FFBCDC' },
  portugues: { bar: '#7C3AED', bg: '#F3EEFF', border: '#D0C4F0' },
  ciencias: { bar: '#0284C7', bg: '#E8F8FF', border: '#B3E0F0' },
  geo: { bar: '#06B6D4', bg: '#E8F8FF', border: '#B3E0F0' },
};

export function SkillDomains({ studentId }: Props) {
  const [skills, setSkills] = useState<{ category: string; label: string; emoji: string; accuracy: number; sessions: number; trend: number }[]>([]);

  useEffect(() => {
    getSkillStats(studentId).then(setSkills);
  }, [studentId]);

  if (skills.length === 0) return null;

  return (
    <div
      style={{
        background: '#fff', border: '2px solid #FFD0BC', borderRadius: 18,
        padding: '16px', boxShadow: '0 3px 0 0 #FFD0BC',
      }}
    >
      <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#3D2C1E', marginBottom: 12 }}>
        🎯 Habilidades
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {skills.map((skill) => {
          const colors = SKILL_COLORS[skill.category] ?? { bar: '#8B6B55', bg: '#F9F5F2', border: '#F0EAE4' };
          return (
            <div
              key={skill.category}
              style={{
                background: colors.bg,
                border: `2px solid ${colors.border}`,
                borderRadius: 14, padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#3D2C1E' }}>
                  {skill.emoji} {skill.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {skill.trend !== 0 && (
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 800,
                      color: skill.trend > 0 ? '#06D6A0' : '#FF6B35',
                    }}>
                      {skill.trend > 0 ? '↑' : '↓'}{Math.abs(skill.trend)}%
                    </span>
                  )}
                  <span style={{
                    fontFamily: "'Baloo 2', sans-serif", fontWeight: 900,
                    fontSize: '1rem', color: colors.bar,
                  }}>
                    {skill.accuracy}%
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.06)' }}>
                <div
                  style={{
                    height: '100%', borderRadius: 4,
                    background: colors.bar,
                    width: `${Math.min(skill.accuracy, 100)}%`,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <p style={{ fontSize: '0.7rem', color: '#B09080', fontWeight: 600, marginTop: 4 }}>
                {skill.sessions} {skill.sessions === 1 ? 'sessão' : 'sessões'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
