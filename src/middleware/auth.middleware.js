import logger from "#config/logger.js";
import { jwttoken } from "#utils/jwt.js";

export const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = jwttoken.verify(token);

    req.user = {
      id: Number(decoded.id),
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (e) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

export const allowSelfOrAdmin = (req, res, next) => {
  const requestedId = Number(req.params.id);

  if (req.user.role === "admin") {
    return next();
  }

  if (req.user.id !== requestedId) {
    return res.status(403).json({
      message: "You can only access your own account",
    });
  }

  next();
};
