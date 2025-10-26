import express from "express"
import { getChatHistoryController,sendMessageController } from "../controllers/chat.controller.js"

const router = express.Router()

router.get('/chat-history/:user1/:user2', getChatHistoryController);
router.post('/send-message', sendMessageController); // POST route

export default router