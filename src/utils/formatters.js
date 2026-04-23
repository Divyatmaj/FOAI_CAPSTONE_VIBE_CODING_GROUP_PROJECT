export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const formatPercent = (value, total) => {
  if (!total) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

export const daysUntil = (dateStr) => {
  if (!dateStr) return 0;
  const diff = new Date(dateStr) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const last10 = (arr) => arr.slice(-10);

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
