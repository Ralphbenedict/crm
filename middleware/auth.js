const { verifyAccessToken } = require('../utils/jwt');
const { User, Role } = require('../models');

// Authentication middleware
const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.access_token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      req.flash('error', 'You must be logged in to view this page');
      return res.redirect('/auth/login');
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      req.flash('error', 'Your session has expired. Please log in again.');
      return res.redirect('/auth/login');
    }

    // Find user
    const user = await User.findByPk(decoded.id, {
      include: [Role]
    });

    if (!user || !user.isActive) {
      req.flash('error', 'User not found or inactive');
      return res.redirect('/auth/login');
    }

    // Add user to request object
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    req.flash('error', 'Authentication error');
    res.redirect('/auth/login');
  }
};

// Role-based authorization middleware
const hasRole = (roleName) => {
  return async (req, res, next) => {
    if (!req.user) {
      return isAuthenticated(req, res, () => checkRole(req, res, next, roleName));
    } else {
      return checkRole(req, res, next, roleName);
    }
  };
};

// Helper function to check role
const checkRole = async (req, res, next, roleName) => {
  try {
    const roles = await req.user.getRoles();
    const hasRequiredRole = roles.some(role => role.name === roleName);

    if (!hasRequiredRole) {
      req.flash('error', 'You do not have permission to access this page');
      return res.redirect('/dashboard');
    }

    next();
  } catch (error) {
    console.error('Role check error:', error);
    req.flash('error', 'Permission check failed');
    res.redirect('/dashboard');
  }
};

module.exports = {
  isAuthenticated,
  hasRole
};
