const adminMiddleware = (req, res, next) => {
  try {
    // Check if user exists (from authMiddleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = adminMiddleware;


