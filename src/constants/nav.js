import {
  BookOpen, Zap, Brain, Clock, BarChart2,
  BookMarked, GraduationCap, Layers, Users, FileText,
  Calendar, Bell, Trophy, Share2, Target
} from 'lucide-react';

export const NAV = {
  student: [
    { path: '/student/setup',      label: 'Setup',      icon: Target },
    { path: '/student/notes',      label: 'Notes',      icon: BookOpen },
    { path: '/student/flashcards', label: 'Flashcards', icon: Layers },
    { path: '/student/planner',    label: 'Planner',    icon: Calendar },
    { path: '/student/quiz',       label: 'Quiz',       icon: Brain },
    { path: '/student/pomodoro',   label: 'Pomodoro',   icon: Clock },
    { path: '/student/progress',   label: 'Progress',   icon: BarChart2 },
  ],
  teacher: [
    { path: '/teacher/dashboard',  label: 'Dashboard',  icon: BarChart2 },
    { path: '/teacher/assignments',label: 'Assignments', icon: BookMarked },
    { path: '/teacher/questions',  label: 'Question Bank', icon: Brain },
    { path: '/teacher/students',   label: 'Students',   icon: Users },
    { path: '/teacher/notes',      label: 'Class Notes', icon: FileText },
  ],
  buddy: [
    { path: '/buddy/flashcards',   label: 'Shared Decks', icon: Layers },
    { path: '/buddy/challenge',    label: 'Quiz Challenge', icon: Zap },
    { path: '/buddy/leaderboard',  label: 'Leaderboard', icon: Trophy },
    { path: '/buddy/schedule',     label: 'Study Schedule', icon: Calendar },
  ],
  parent: [
    { path: '/parent/overview',    label: 'Overview',   icon: GraduationCap },
    { path: '/parent/reports',     label: 'Reports',    icon: BarChart2 },
    { path: '/parent/schedule',    label: 'Schedule',   icon: Calendar },
    { path: '/parent/reminders',   label: 'Reminders',  icon: Bell },
  ],
};

export const ROLE_CONFIG = {
  student: { label: 'Student',  color: 'accent',  emoji: '🎓' },
  teacher: { label: 'Teacher',  color: 'purple',  emoji: '📚' },
  buddy:   { label: 'Buddy',    color: 'teal',    emoji: '🤝' },
  parent:  { label: 'Parent',   color: 'blue',    emoji: '👤' },
};
