import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env (shared with Vite, but we only read non-VITE vars here)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const {
  MONGO_URI,
  JWT_SECRET,
  PORT = 4001,
  CLIENT_ORIGIN = 'http://localhost:3000',
} = process.env;

if (!MONGO_URI) {
  throw new Error('Missing MONGO_URI in .env');
}
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in .env');
}

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

async function start() {
  // ── Route registration ──────────────────────────────────────────
  const { default: authRouter }    = await import('./routes/auth.js');
  const { default: studentRouter } = await import('./routes/student.js');
  const { default: teacherRouter } = await import('./routes/teacher.js');
  const { default: parentRouter }  = await import('./routes/parent.js');

  app.use('/api/auth',    authRouter);
  app.use('/api/student', studentRouter);
  app.use('/api/teacher', teacherRouter);
  app.use('/api/parent',  parentRouter);

  // ── Error handler (MUST be after all routes) ────────────────────
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message || 'Server error' });
  });

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  app.listen(Number(PORT), () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
