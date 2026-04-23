import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl px-3 py-2 shadow-card text-xs">
      <p className="text-gray-400">{payload[0]?.payload?.topic}</p>
      <p className="text-danger font-bold">{payload[0].value} misses</p>
    </div>
  );
};

const WeakTopicsChart = ({ weakTopics = {} }) => {
  const data = Object.entries(weakTopics)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([topic, count]) => ({ topic: topic.length > 14 ? topic.slice(0, 14) + '…' : topic, count }));

  if (!data.length) return (
    <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
      No weak topics tracked yet
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2e3040" />
        <XAxis dataKey="topic" tick={{ fill: '#6b7280', fontSize: 10 }} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#f26b6b" radius={[4, 4, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeakTopicsChart;
