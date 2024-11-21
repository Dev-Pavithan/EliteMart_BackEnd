import express from "express";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";
import { login } from "../controllers/authController.js";

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Login for both users and sellers
 * @access Public
 */
router.post("/login", login);

export default router;
