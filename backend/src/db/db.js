import mongoose from 'mongoose';
import config from "../config/config.js";

async function connectDB() {
    try {
        const conn = await mongoose.connect(config.MONGODB_URL);
        console.log("MongoDB connected successfully to:", conn.connection.host);
        console.log("Database name:", conn.connection.name);
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}


export default connectDB;