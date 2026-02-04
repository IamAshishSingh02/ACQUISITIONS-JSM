import { Router } from "express";

import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from "#controllers/users.controller.js";

import {
  authenticateToken,
  requireRole,
  allowSelfOrAdmin,
} from "#middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticateToken,
  requireRole("admin"),
  fetchAllUsers
);

router.get(
  "/:id",
  authenticateToken,
  allowSelfOrAdmin,
  fetchUserById
);

router.put(
  "/:id",
  authenticateToken,
  allowSelfOrAdmin,
  updateUserById
);

router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  deleteUserById
);

export default router;
