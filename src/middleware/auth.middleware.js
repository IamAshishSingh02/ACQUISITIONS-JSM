import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';

export const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      logger.warn('No token provided - Authentication required');

      return res.status(401).json({
        message: 'Authentication required',
      });
    }

    const decoded = jwttoken.verify(token);

    req.user = {
      id: Number(decoded.id),
      email: decoded.email,
      role: decoded.role,
    };

    logger.info(`User authenticated: ${decoded.email} (${decoded.role})`);

    next();
  } catch (error) {
    logger.error('Token verification failed:', error);

    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Role check failed - User not authenticated');

      return res.status(401).json({
        message: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(
        `Access denied for ${req.user.email} (role: ${req.user.role}) - Required: ${allowedRoles.join(
          ', '
        )}`
      );

      return res.status(403).json({
        message: 'Access denied',
      });
    }

    logger.info(`Role access granted: ${req.user.email} (${req.user.role})`);

    next();
  };
};

export const allowSelfOrAdmin = (req, res, next) => {
  const requestedId = Number(req.params.id);

  if (!req.user) {
    logger.warn('Ownership check failed - User not authenticated');

    return res.status(401).json({
      message: 'Authentication required',
    });
  }

  if (req.user.role === 'admin') {
    logger.info(
      `Admin access granted for ${req.user.email} → userId=${requestedId}`
    );
    return next();
  }

  if (req.user.id !== requestedId) {
    logger.warn(
      `Ownership denied: ${req.user.email} tried accessing userId=${requestedId}`
    );

    return res.status(403).json({
      message: 'You can only access your own account',
    });
  }

  logger.info(`Self access granted: ${req.user.email}`);

  next();
};
