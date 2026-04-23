import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// All routes here require: valid JWT + role === 'parent'
router.use(requireAuth, requireRole('parent'));

/**
 * GET /api/parent/data
 * Returns the authenticated parent's profile stub.
 */
router.get('/data', (req, res) => {
  res.json({
    id: req.user.sub,
    email: req.user.email,
    role: req.user.role,
    message: 'Parent data endpoint.',
  });
});

export default router;
