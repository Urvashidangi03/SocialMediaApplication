import { findUserById, findUsers, addFollower, removeFollower } from "../dao/user.dao.js";

export async function getCurrentUserController(req, res) {
    try {
        res.json(req.user);
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ message: 'Failed to get current user' });
    }
}

export async function searchUsersController(req, res) {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const users = await findUsers(query);
        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Failed to search users' });
    }
}

export async function followUserController(req, res) {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        if (userId === currentUserId.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const userToFollow = await findUserById(userId);
        if (!userToFollow) {
            return res.status(404).json({ message: "User not found" });
        }

        await addFollower(userId, currentUserId);
        res.json({ message: "Successfully followed user" });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ message: 'Failed to follow user' });
    }
}

export async function unfollowUserController(req, res) {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        if (userId === currentUserId.toString()) {
            return res.status(400).json({ message: "You cannot unfollow yourself" });
        }

        const userToUnfollow = await findUserById(userId);
        if (!userToUnfollow) {
            return res.status(404).json({ message: "User not found" });
        }

        await removeFollower(userId, currentUserId);
        res.json({ message: "Successfully unfollowed user" });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ message: 'Failed to unfollow user' });
    }
}