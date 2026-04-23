import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// All routes here require: valid JWT + role === 'teacher'
router.use(requireAuth, requireRole('teacher'));

/**
 * GET /api/teacher/data
 * Returns the authenticated teacher's profile stub.
 */
router.get('/data', (req, res) => {
  res.json({
    id: req.user.sub,
    email: req.user.email,
    role: req.user.role,
    message: 'Teacher data endpoint.',
  });
});

export default router;
