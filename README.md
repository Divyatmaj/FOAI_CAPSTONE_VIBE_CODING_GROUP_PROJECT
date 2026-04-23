# 🧠 Smart Study Assistant+

AI-powered study platform with 4 role-based dashboards, built with **Vite + React 18**.

## Features

| Role | Pages |
|---|---|
| 🎓 Student | Setup → Notes → Flashcards → Planner → Quiz → Pomodoro → Progress |
| 📚 Teacher | Dashboard → Assignments → Question Bank → Student Reports → Class Notes |
| 🤝 Buddy   | Shared Flashcards → Quiz Challenge → Leaderboard → Study Schedule |
| 👤 Parent  | Overview → Reports → Schedule → Reminders |

**AI Features** (via OpenRouter):
- Structured markdown study notes (style & level aware)
- 12 flip-card flashcards with hints & difficulty
- Personalized N-day study planner with type-coded days
- 10-question multiple-choice quiz + speed round mode
- Post-quiz AI feedback paragraph

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure API key
```bash
cp .env.example .env
```
Open `.env` and paste your OpenRouter API key:
```
VITE_OPENROUTER_API_KEY=sk-or-v1-...
```
> Get your key at [openrouter.ai/keys](https://openrouter.ai/keys)

### 3. Run dev server
```bash
npm run dev
```
App opens at **http://localhost:3000**

> **Tip:** You can also paste your API key at runtime via the **⚙️ Settings** button — no restart needed.

## Tech Stack

- **React 18 + Vite 5** — lightning-fast dev server
- **React Router v6** — role-based SPA routing
- **Zustand** — global state with localStorage persistence
- **Tailwind CSS 3** — custom dark/gold design system
- **Framer Motion 11** — page transitions, flashcard flip, pomodoro ring
- **Recharts 2** — score history & weak topics charts
- **React Hot Toast** — slide-in notifications
- **Lucide React** — icon system
- **React Markdown** — AI notes rendering

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Design System

| Token | Value | Usage |
|---|---|---|
| `bg` | `#0e0f14` | Page background |
| `surface` | `#16181f` | Cards |
| `accent` | `#f5c842` | Gold — primary highlight |
| `purple` | `#8b7cf8` | Teacher role |
| `teal` | `#3dcfb4` | Buddy role |
| `blue` | `#5baef5` | Parent role |
