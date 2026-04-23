/**
 * Role-Based Access Control middleware.
 * Must be used AFTER requireAuth so that req.user is populated.
 *
 * Usage:  router.get('/path', requireAuth, requireRole('student'), handler)
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
    }
    next();
  };
}
