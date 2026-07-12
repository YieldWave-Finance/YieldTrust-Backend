const auth = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    let role = null;

    if (token === process.env.ADMIN_API_KEY) {
      role = 'admin';
    } else if (token === process.env.GRANT_MANAGER_API_KEY) {
      role = 'grant_manager';
    } else if (token === process.env.ESCROW_OWNER_API_KEY) {
      role = 'escrow_owner';
    }

    if (!role) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role' });
    }

    req.user = { role };
    next();
  };
};

module.exports = auth;
