import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

import Layout from './components/layout/Layout';
import Modal from './components/ui/Modal';
import Button from './components/ui/Button';
import useAppStore from './store/useAppStore';
import useAuthStore from './store/useAuthStore';
import { MODELS } from './constants/models';
import ProtectedRoute, { ROLE_HOME } from './routes/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Student Pages
import Setup      from './pages/student/Setup';
import Notes      from './pages/student/Notes';
import Flashcards from './pages/student/Flashcards';
import Planner    from './pages/student/Planner';
import Quiz       from './pages/student/Quiz';
import Pomodoro   from './pages/student/Pomodoro';
import Progress   from './pages/student/Progress';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import Assignments      from './pages/teacher/Assignments';
import QuestionBank     from './pages/teacher/QuestionBank';
import StudentReports   from './pages/teacher/StudentReports';
import SharedNotes      from './pages/teacher/SharedNotes';

// Buddy Pages (student sub-feature)
import SharedFlashcards from './pages/buddy/SharedFlashcards';
import QuizChallenge    from './pages/buddy/QuizChallenge';
import Leaderboard      from './pages/buddy/Leaderboard';
import StudySchedule    from './pages/buddy/StudySchedule';

// Parent Pages
import Overview   from './pages/parent/Overview';
import Reports    from './pages/parent/Reports';
import Schedule   from './pages/parent/Schedule';
import Reminders  from './pages/parent/Reminders';

// ── Helpers ────────────────────────────────────────────────────────
/** Resolve the landing page for the current user's role */
function getLandingPage(user) {
  return ROLE_HOME[user?.role] || '/login';
}

// ── Settings Modal ──────────────────────────────────────────────
const SettingsModal = ({ open, onClose }) => {
  const { apiKey, setApiKey, clearAllData } = useAppStore();
  const [keyInput, setKeyInput] = useState(apiKey || localStorage.getItem('or_key') || '');
  const [showKey, setShowKey] = useState(false);

  const handleSaveKey = () => {
    localStorage.setItem('or_key', keyInput);
    setApiKey(keyInput);
    onClose();
  };

  const handleClearData = () => {
    if (confirm('Clear all generated content? (notes, flashcards, quiz, planner)')) {
      clearAllData();
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="⚙️ Settings" maxWidth="max-w-md">
      <div className="space-y-6">
        {/* API Key */}
        <div>
          <label className="label">OpenRouter API Key</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              className="input pr-10"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="sk-or-v1-..."
            />
            <button onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
              {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Get your key at{' '}
            <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">openrouter.ai/keys</a>
          </p>
        </div>



        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="danger" onClick={handleClearData} icon={Trash2} size="sm">
            Clear Data
          </Button>
          <Button fullWidth onClick={handleSaveKey}>Save Settings</Button>
        </div>
      </div>
    </Modal>
  );
};

// ── App ───────────────────────────────────────────────────────────
const App = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const { token, user } = useAuthStore();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#ffffff', color: '#0f172a', border: '1px solid #e6e8f5', borderRadius: '12px', fontSize: '13px' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#ffffff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
        }}
      />

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Auth */}
          <Route path="/login" element={token ? <Navigate to={getLandingPage(user)} replace /> : <Login />} />
          <Route path="/signup" element={token ? <Navigate to={getLandingPage(user)} replace /> : <Signup />} />

          {/* Default redirect */}
          <Route index element={<Navigate to={token ? getLandingPage(user) : '/login'} replace />} />

          {/* ── Student routes (also includes Buddy as sub-feature) ── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout onSettings={() => setSettingsOpen(true)}>
                  <Outlet />
                </Layout>
              </ProtectedRoute>
            }
          >
            <Route path="/student/setup" element={<Setup />} />
            <Route path="/student/notes" element={<Notes />} />
            <Route path="/student/flashcards" element={<Flashcards />} />
            <Route path="/student/planner" element={<Planner />} />
            <Route path="/student/quiz" element={<Quiz />} />
            <Route path="/student/pomodoro" element={<Pomodoro />} />
            <Route path="/student/progress" element={<Progress />} />

            {/* Buddy is a student sub-feature */}
            <Route path="/buddy/flashcards" element={<SharedFlashcards />} />
            <Route path="/buddy/challenge" element={<QuizChallenge />} />
            <Route path="/buddy/leaderboard" element={<Leaderboard />} />
            <Route path="/buddy/schedule" element={<StudySchedule />} />
          </Route>

          {/* ── Teacher routes ── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout onSettings={() => setSettingsOpen(true)}>
                  <Outlet />
                </Layout>
              </ProtectedRoute>
            }
          >
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/assignments" element={<Assignments />} />
            <Route path="/teacher/questions" element={<QuestionBank />} />
            <Route path="/teacher/students" element={<StudentReports />} />
            <Route path="/teacher/notes" element={<SharedNotes />} />
          </Route>

          {/* ── Parent routes ── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <Layout onSettings={() => setSettingsOpen(true)}>
                  <Outlet />
                </Layout>
              </ProtectedRoute>
            }
          >
            <Route path="/parent/overview" element={<Overview />} />
            <Route path="/parent/reports" element={<Reports />} />
            <Route path="/parent/schedule" element={<Schedule />} />
            <Route path="/parent/reminders" element={<Reminders />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={token ? getLandingPage(user) : '/login'} replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
