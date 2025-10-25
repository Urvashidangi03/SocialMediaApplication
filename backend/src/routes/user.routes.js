import express from "express";
import { searchUsersController, followUserController, unfollowUserController, getCurrentUserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get current user
router.get('/me', authMiddleware, getCurrentUserController);

// Search users
router.get('/search', authMiddleware, searchUsersController);

// Follow/unfollow
router.post('/follow/:userId', authMiddleware, followUserController);
router.post('/unfollow/:userId', authMiddleware, unfollowUserController);

export default router;