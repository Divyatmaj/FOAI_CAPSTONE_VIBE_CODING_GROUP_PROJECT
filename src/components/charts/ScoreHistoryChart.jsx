import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl px-3 py-2 shadow-card text-xs">
      <p className="text-gray-400 mb-1">Attempt {label}</p>
      <p className="text-accent font-bold">{payload[0].value}%</p>
    </div>
  );
};

const ScoreHistoryChart = ({ scores = [] }) => {
  const data = scores.slice(-10).map((s, i) => ({ attempt: i + 1, score: s }));

  if (!data.length) return (
    <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
      No quiz attempts yet
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2e3040" />
        <XAxis dataKey="attempt" tick={{ fill: '#6b7280', fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={70} stroke="#f5c842" strokeDasharray="4 4" strokeOpacity={0.4} />
        <Line
          type="monotone" dataKey="score"
          stroke="#f5c842" strokeWidth={2.5}
          dot={{ fill: '#f5c842', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#f5c842', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScoreHistoryChart;
