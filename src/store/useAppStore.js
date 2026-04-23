import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MOCK_STUDENTS = [
  { id: 1, name: 'Alice Johnson',   subject: 'Mathematics', score: 88, streak: 7,  status: 'active',   lastSeen: '2025-04-15' },
  { id: 2, name: 'Bob Smith',       subject: 'Physics',     score: 64, streak: 3,  status: 'at-risk',  lastSeen: '2025-04-14' },
  { id: 3, name: 'Clara Davis',     subject: 'Chemistry',   score: 91, streak: 14, status: 'active',   lastSeen: '2025-04-15' },
  { id: 4, name: 'David Lee',       subject: 'Biology',     score: 55, streak: 1,  status: 'at-risk',  lastSeen: '2025-04-12' },
  { id: 5, name: 'Emma Wilson',     subject: 'History',     score: 78, streak: 5,  status: 'active',   lastSeen: '2025-04-15' },
  { id: 6, name: 'Frank Miller',    subject: 'English',     score: 82, streak: 9,  status: 'active',   lastSeen: '2025-04-15' },
];

const MOCK_ASSIGNMENTS = [
  { id: 1, title: 'Chapter 5 Quiz',       subject: 'Mathematics', dueDate: '2025-04-20', status: 'active',    submissions: 18, total: 24 },
  { id: 2, title: 'Lab Report Writing',   subject: 'Chemistry',   dueDate: '2025-04-18', status: 'active',    submissions: 12, total: 20 },
  { id: 3, title: 'Essay — WWI Causes',   subject: 'History',     dueDate: '2025-04-16', status: 'overdue',   submissions: 8,  total: 22 },
  { id: 4, title: 'Genetics Flashcards',  subject: 'Biology',     dueDate: '2025-04-25', status: 'upcoming',  submissions: 0,  total: 18 },
];

const MOCK_LEADERBOARD = [
  { id: 1, name: 'Clara Davis',  avatar: 'CD', score: 2840, streak: 14, badges: ['🏆', '⚡', '🔥'] },
  { id: 2, name: 'Alice Johnson',avatar: 'AJ', score: 2610, streak: 7,  badges: ['⭐', '🔥'] },
  { id: 3, name: 'Frank Miller', avatar: 'FM', score: 2480, streak: 9,  badges: ['⭐'] },
  { id: 4, name: 'Emma Wilson',  avatar: 'EW', score: 2100, streak: 5,  badges: [] },
  { id: 5, name: 'Bob Smith',    avatar: 'BS', score: 1870, streak: 3,  badges: [] },
  { id: 6, name: 'You',          avatar: 'ME', score: 1650, streak: 2,  badges: [] },
];

const useAppStore = create(
  persist(
    (set, get) => ({
      // ── API Key
      apiKey: '',

      // ── Study Setup
      subject: '',
      chapter: '',
      examDate: '',
      hoursPerDay: 2,
      level: 'intermediate',
      subtopics: [],
      noteStyle: 'concise',

      // ── Generated Content
      notes: '',
      flashcards: [],
      planner: [],

      // ── Quiz
      quizQuestions: [],
      quizState: null,
      scores: [],

      // ── Progress
      cardsStudied: 0,
      bookmarked: [],
      weakTopics: {},
      studyHeatmap: {},
      streak: 0,
      ratings: {},

      // ── Pomodoro
      pomodoroTime: 1500,
      pomodoroRunning: false,
      pomodoroMode: 'study',
      pomoSessions: 0,

      // ── Teacher / Admin Data
      students: MOCK_STUDENTS,
      assignments: MOCK_ASSIGNMENTS,
      customQuestions: [],
      reminders: [],
      leaderboard: MOCK_LEADERBOARD,

      // ── Actions
      setApiKey: (apiKey) => set({ apiKey }),

      setSubject: (subject) => set({ subject }),
      setChapter: (chapter) => set({ chapter }),
      setExamDate: (examDate) => set({ examDate }),
      setHoursPerDay: (hoursPerDay) => set({ hoursPerDay }),
      setLevel: (level) => set({ level }),
      setSubtopics: (subtopics) => set({ subtopics }),
      setNoteStyle: (noteStyle) => set({ noteStyle }),

      setNotes: (notes) => set({ notes }),
      setFlashcards: (flashcards) => set({ flashcards }),
      setPlanner: (planner) => set({ planner }),

      setQuizQuestions: (quizQuestions) => set({ quizQuestions }),
      setQuizState: (quizState) => set({ quizState }),
      addScore: (score) => {
        const scores = [...get().scores, score].slice(-20);
        set({ scores });
        // update heatmap
        const today = new Date().toISOString().split('T')[0];
        const heatmap = { ...get().studyHeatmap };
        heatmap[today] = (heatmap[today] || 0) + 1;
        set({ studyHeatmap: heatmap });
      },

      addWeakTopic: (topic) => {
        const wt = { ...get().weakTopics };
        wt[topic] = (wt[topic] || 0) + 1;
        set({ weakTopics: wt });
      },

      toggleBookmark: (idx) => {
        const bm = [...get().bookmarked];
        const pos = bm.indexOf(idx);
        if (pos === -1) bm.push(idx);
        else bm.splice(pos, 1);
        set({ bookmarked: bm });
      },

      incrementCardsStudied: () => {
        set((s) => ({ cardsStudied: s.cardsStudied + 1 }));
        get().recordActivity();
      },

      markDayDone: (idx) => {
        const planner = get().planner.map((d, i) =>
          i === idx ? { ...d, done: !d.done } : d
        );
        set({ planner });
        get().recordActivity();
      },

      setPomodoro: (patch) => set((s) => ({ ...s, ...patch })),
      incrementPomoSessions: () => set((s) => ({ pomoSessions: s.pomoSessions + 1 })),

      setRating: (key, val) => {
        set((s) => ({ ratings: { ...s.ratings, [key]: val } }));
        get().recordActivity();
      },

      recordActivity: () => {
        const today = new Date().toISOString().split('T')[0];
        const heatmap = { ...get().studyHeatmap };
        heatmap[today] = (heatmap[today] || 0) + 1;
        set({ studyHeatmap: heatmap });
      },

      addReminder: (reminder) =>
        set((s) => ({ reminders: [...s.reminders, { ...reminder, id: Date.now() }] })),
      removeReminder: (id) =>
        set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) })),

      addCustomQuestion: (q) =>
        set((s) => ({ customQuestions: [...s.customQuestions, { ...q, id: Date.now() }] })),
      removeCustomQuestion: (id) =>
        set((s) => ({ customQuestions: s.customQuestions.filter((q) => q.id !== id) })),

      addAssignment: (a) =>
        set((s) => ({ assignments: [...s.assignments, { ...a, id: Date.now() }] })),
      removeAssignment: (id) =>
        set((s) => ({ assignments: s.assignments.filter((a) => a.id !== id) })),

      clearAllData: () => set({
        notes: '', flashcards: [], planner: [], quizQuestions: [], quizState: null,
        scores: [], cardsStudied: 0, bookmarked: [], weakTopics: {}, studyHeatmap: {},
        streak: 0, ratings: {}, customQuestions: [], reminders: [],
      }),
    }),
    {
      name: 'smart-study-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        subject: state.subject,
        chapter: state.chapter,
        examDate: state.examDate,
        hoursPerDay: state.hoursPerDay,
        level: state.level,
        subtopics: state.subtopics,
        noteStyle: state.noteStyle,
        notes: state.notes,
        flashcards: state.flashcards,
        planner: state.planner,
        quizQuestions: state.quizQuestions,
        scores: state.scores,
        cardsStudied: state.cardsStudied,
        bookmarked: state.bookmarked,
        weakTopics: state.weakTopics,
        studyHeatmap: state.studyHeatmap,
        streak: state.streak,
        ratings: state.ratings,
        customQuestions: state.customQuestions,
        reminders: state.reminders,
        assignments: state.assignments,
      }),
    }
  )
);

export default useAppStore;
