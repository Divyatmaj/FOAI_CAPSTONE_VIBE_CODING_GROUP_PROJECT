import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';
import usePomodoro from '../../hooks/usePomodoro';
import PomodoroRing from '../../components/pomodoro/PomodoroRing';
import Button from '../../components/ui/Button';

const TIPS = [
  '🧠 Break complex topics into smaller chunks before each session.',
  '💧 Stay hydrated — dehydration reduces focus by up to 25%.',
  '📵 Put your phone in another room during study sessions.',
  '✍️ After the timer, write down the 3 most important things you learned.',
  '🎵 Instrumental music or white noise can boost concentration.',
  '🌿 A 5-minute walk outside resets your attention better than scrolling.',
];

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Pomodoro = () => {
  const { minutes, seconds, progress, pomodoroRunning, pomodoroMode, pomoSessions, start, pause, reset, changeMode, setCustomTime, MODES } = usePomodoro();
  const [customM, setCustomM] = useState('');

  const modeLabels = { study: '📚 Study', short: '☕ Short Break', long: '🛌 Long Break' };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display text-white">Pomodoro Timer</h1>
        <p className="text-gray-400 text-sm mt-1">Focus in sprints. Rest. Repeat.</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2">
        {Object.entries(modeLabels).map(([mode, label]) => (
          <button key={mode} onClick={() => changeMode(mode)}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              pomodoroMode === mode ? 'bg-accent/10 border-accent text-accent' : 'border-border text-gray-400 hover:border-gray-600'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Ring + timer */}
      <div className="card flex flex-col items-center py-10 gap-6">
        <PomodoroRing progress={progress} running={pomodoroRunning} size={220} />
        <div className="text-center -mt-2">
          <p className="text-6xl font-bold font-mono text-white tracking-tight">
            {minutes}:{seconds}
          </p>
          <p className="text-sm text-gray-400 mt-1 capitalize">{pomodoroMode === 'study' ? 'Focus Time' : 'Break Time'}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {pomodoroRunning ? (
            <Button onClick={pause} variant="ghost" icon={Pause}>Pause</Button>
          ) : (
            <Button onClick={start} icon={Play}>Start</Button>
          )}
          <Button onClick={reset} variant="ghost" icon={RotateCcw}>Reset</Button>
        </div>

        {/* Sessions */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Zap size={14} className="text-accent" />
          <span>Sessions completed: <span className="text-accent font-bold">{pomoSessions}</span></span>
        </div>
      </div>

      {/* Custom timer */}
      <div className="card">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Custom Duration</h2>
        <div className="flex gap-3">
          <input
            type="number" min={1} max={120}
            className="input" placeholder="Minutes (1–120)"
            value={customM} onChange={(e) => setCustomM(e.target.value)}
          />
          <Button variant="ghost" onClick={() => customM && setCustomTime(Number(customM))}>Set</Button>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
          <Coffee size={14} className="text-teal" /> Study Tips
        </h2>
        <ul className="space-y-3">
          {TIPS.map((t, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="text-sm text-gray-400 flex items-start gap-2">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {t}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Pomodoro;
