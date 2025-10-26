import setupSocket from "./src/sockets/socket.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/db/db.js";
import app from "./src/app.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { createMessage } from "./src/dao/message.dao.js";

const httpServer = createServer(app);

// Connect to MongoDB
await connectDB();

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {}; // Map of userId -> socketId

io.use((socket, next) => {
        const cookies = socket.request.headers.cookie
        const { token } = cookie.parse(cookies || "")

        if (!token) {
            return next(new Error("Authentication error"))
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            socket.user = decoded; // Attach user info to socket
            next();

        } catch (err) {
            return next(new Error("Authentication error"))
        }

    })

    io.on("connection", (socket) => {

        users[ socket.user._id ] = socket.id
        console.log(users)

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });

        socket.on("send-message", async (msg) => {
            console.log(msg);
            
            const { receiver /* mongodb id */, message } = msg
            socket.to(users[ receiver ]).emit("message", message)
            // await createMessage({
            //     receiver,
            //     sender: socket.user._id,
            //     text: message
            // })
        })
    })
httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
