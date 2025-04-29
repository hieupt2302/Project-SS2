const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      return next();
    }
    return res.status(403).json({ message: `Forbidden: ${requiredRole} access required` });
  };
};

module.exports = checkRole;