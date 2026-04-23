import { Router } from 'express';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

router.post('/signup', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');
    const role = String(req.body.role || '');

    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    if (!['student', 'teacher', 'parent'].includes(role)) {
      return res.status(400).json({ error: 'Role must be student, teacher, or parent' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash, role });

    const token = signToken({ sub: user._id.toString(), email: user.email, role: user.role });
    res.json({
      token,
      user: { id: user._id.toString(), email: user.email, role: user.role },
    });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken({ sub: user._id.toString(), email: user.email, role: user.role });
    res.json({
      token,
      user: { id: user._id.toString(), email: user.email, role: user.role },
    });
  } catch (e) {
    next(e);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).select('email role');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id.toString(), email: user.email, role: user.role });
  } catch (e) {
    next(e);
  }
});

export default router;

