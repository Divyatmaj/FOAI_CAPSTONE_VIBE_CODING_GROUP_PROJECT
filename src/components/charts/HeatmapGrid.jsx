import React from 'react';

const INTENSITY = ['bg-surface2', 'bg-teal/20', 'bg-teal/40', 'bg-teal/70', 'bg-teal'];

const getLast28Days = () => {
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

const HeatmapGrid = ({ heatmap = {} }) => {
  const days = getLast28Days();
  const max = Math.max(1, ...Object.values(heatmap));

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <p key={d} className="text-[9px] text-gray-600 text-center mb-0.5">{d}</p>
        ))}
        {days.map((date) => {
          const count = heatmap[date] || 0;
          const level = Math.min(4, Math.round((count / max) * 4));
          return (
            <div
              key={date}
              title={`${date}: ${count} session${count !== 1 ? 's' : ''}`}
              className={`h-6 rounded-sm ${INTENSITY[level]} transition-colors cursor-default`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px] text-gray-500">Less</span>
        {INTENSITY.map((c, i) => (
          <div key={i} className={`w-3.5 h-3.5 rounded-sm ${c}`} />
        ))}
        <span className="text-[10px] text-gray-500">More</span>
      </div>
    </div>
  );
};

export default HeatmapGrid;
