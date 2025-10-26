import { createMessage, getChatHistory } from "../dao/message.dao.js";

// Fetch chat history
export async function getChatHistoryController(req, res) {
  try {
    const { user1, user2 } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const chatHistory = await getChatHistory(user1, user2, limit, skip);
    res.status(200).json({
      message: "Chat history fetched successfully",
      chatHistory
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching chat history" });
  }
}

// Send a new message
export async function sendMessageController(req, res) {
  try {
    const { sender, receiver, text } = req.body;
    const message = await createMessage({ sender, receiver, text });
    res.status(201).json({
      message: "Message sent successfully",
      data: message
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message" });
  }
}
