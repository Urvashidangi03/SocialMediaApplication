import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import { createServer } from "http";
import setupSocket from "./src/sockets/socket.js";

const httpServer = createServer(app);


async function startServer() {
    try {
        await connectDB();
        setupSocket(httpServer);
        
        httpServer.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

startServer();

// async function startServer() {
//     try {
//         await connectDB();
//         app.listen(3000, () => {
//             console.log("server is running on port 3000");
//         });
//     } catch (err) {
//         console.error("Failed to connect to MongoDB. Server not started.", err);
//         process.exit(1);
//     }
// }

// startServer();