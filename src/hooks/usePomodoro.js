import { useEffect, useRef, useCallback } from 'react';
import useAppStore from '../store/useAppStore';

const MODES = {
  study: { duration: 25 * 60, label: 'Study' },
  short: { duration: 5 * 60,  label: 'Short Break' },
  long:  { duration: 15 * 60, label: 'Long Break' },
};

const usePomodoro = () => {
  const { pomodoroTime, pomodoroRunning, pomodoroMode, pomoSessions, pomodoroTotal, setPomodoro, incrementPomoSessions } =
    useAppStore();
  const intervalRef = useRef(null);

  const tick = useCallback(() => {
    const current = useAppStore.getState().pomodoroTime;
    if (current <= 1) {
      setPomodoro({ pomodoroRunning: false, pomodoroTime: 0 });
      if (useAppStore.getState().pomodoroMode === 'study') incrementPomoSessions();
      // Track heatmap for completed session
      const today = new Date().toISOString().split('T')[0];
      const heatmap = { ...useAppStore.getState().studyHeatmap };
      heatmap[today] = (heatmap[today] || 0) + 1;
      setPomodoro({ studyHeatmap: heatmap });
      clearInterval(intervalRef.current);
    } else {
      setPomodoro({ pomodoroTime: current - 1 });
    }
  }, [setPomodoro, incrementPomoSessions]);

  useEffect(() => {
    if (pomodoroRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [pomodoroRunning, tick]);

  const start  = () => setPomodoro({ pomodoroRunning: true });
  const pause  = () => setPomodoro({ pomodoroRunning: false });
  const reset  = () => {
    const dur = MODES[pomodoroMode].duration;
    setPomodoro({ pomodoroRunning: false, pomodoroTime: dur, pomodoroTotal: dur });
  };
  const changeMode = (mode) => {
    const dur = MODES[mode].duration;
    setPomodoro({ pomodoroMode: mode, pomodoroRunning: false, pomodoroTime: dur, pomodoroTotal: dur });
  };
  const setCustomTime = (minutes) => {
    const dur = minutes * 60;
    setPomodoro({ pomodoroRunning: false, pomodoroTime: dur, pomodoroTotal: dur });
  };

  // Use pomodoroTotal (tracks actual timer duration) instead of mode duration for custom timers
  const total = pomodoroTotal || MODES[pomodoroMode]?.duration || 1500;
  const progress = total > 0 ? 1 - pomodoroTime / total : 0;
  const minutes = Math.floor(pomodoroTime / 60).toString().padStart(2, '0');
  const seconds = (pomodoroTime % 60).toString().padStart(2, '0');

  return { minutes, seconds, progress, pomodoroRunning, pomodoroMode, pomoSessions, start, pause, reset, changeMode, setCustomTime, MODES };
};

export default usePomodoro;
