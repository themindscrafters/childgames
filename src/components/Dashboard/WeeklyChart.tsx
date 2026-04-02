import { useState, useEffect } from 'react';
import { getWeeklyStats } from '../../data/db';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface Props {
  studentId: number;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export function WeeklyChart({ studentId }: Props) {
  const [data, setData] = useState<{ days: { date: string; accuracy: number; sessions: number; minutes: number }[]; trend: number } | null>(null);

  useEffect(() => {
    getWeeklyStats(studentId).then(setData);
  }, [studentId]);

  if (!data) return null;

  const hasData = data.days.some(d => d.sessions > 0);

  if (!hasData) {
    return (
      <div
        style={{
          background: '#fff', border: '2px solid #F0EAE4', borderRadius: 18,
          padding: '16px', boxShadow: '0 3px 0 0 #F0EAE4', textAlign: 'center',
        }}
      >
        <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#8B6B55' }}>
          📊 Sem dados suficientes para o gráfico semanal
        </p>
        <p style={{ fontSize: '0.8rem', color: '#B09080', marginTop: 4 }}>
          Jogue mais pra ver a evolução aqui!
        </p>
      </div>
    );
  }

  const chartData = data.days.map(d => ({
    name: WEEKDAYS[new Date(d.date + 'T12:00:00').getDay()],
    acerto: d.sessions > 0 ? d.accuracy : null,
    minutos: d.minutes,
  }));

  return (
    <div
      style={{
        background: '#fff', border: '2px solid #B3F0E0', borderRadius: 18,
        padding: '16px', boxShadow: '0 3px 0 0 #B3F0E0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#3D2C1E' }}>
          📈 Evolução semanal
        </h3>
        {data.trend !== 0 && (
          <span
            style={{
              fontSize: '0.8rem', fontWeight: 800,
              color: data.trend > 0 ? '#06D6A0' : '#FF6B35',
              background: data.trend > 0 ? '#E8FFF5' : '#FFF0E8',
              padding: '4px 10px', borderRadius: 20,
            }}
          >
            {data.trend > 0 ? '↑' : '↓'} {Math.abs(data.trend)}%
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06D6A0" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06D6A0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8B6B55' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#B09080' }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Acerto']}
            contentStyle={{ borderRadius: 12, border: '1px solid #B3F0E0', fontSize: '0.8rem' }}
          />
          <Area
            type="monotone"
            dataKey="acerto"
            stroke="#06D6A0"
            strokeWidth={3}
            fill="url(#colorAccuracy)"
            dot={{ r: 5, fill: '#06D6A0', stroke: '#fff', strokeWidth: 2 }}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
