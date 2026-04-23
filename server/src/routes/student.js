import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// All routes here require: valid JWT + role === 'student'
router.use(requireAuth, requireRole('student'));

/**
 * GET /api/student/data
 * Returns the authenticated student's profile stub.
 * Study content (notes, flashcards, etc.) is stored client-side in localStorage.
 */
router.get('/data', (req, res) => {
  res.json({
    id: req.user.sub,
    email: req.user.email,
    role: req.user.role,
    message: 'Student data endpoint — study content is managed client-side.',
  });
});

export default router;
