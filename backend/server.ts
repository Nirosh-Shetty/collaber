import dotenv from "dotenv";
dotenv.config(); // Load environment variables
import express from "express";
import mongoose from "mongoose";
import router from "./routes/Route";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import "./config/passport"; // this should point to the config file above
import initializeSocket from "./socket";
import messagingRouter from "./routes/messaging.route";

const app = express();

app.use(cookieParser());
// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "role"],
  })
);

// Session (required by some strategies, even if you disable it later)
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Trust proxy for secure cookies in production (if behind a reverse proxy)
app.set("trust proxy", true);

// Initialize Socket.io BEFORE adding routes (creates HTTP server and attaches Express to it)
const { httpServer } = initializeSocket(app);

app.use("/api", router);
app.use("/api/messaging", messagingRouter);

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MongoDB connection string (MONGO_BASE_URL) is missing!");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

connectDB(); // Call the function to establish the connection

// Start single server with both Express and Socket.io
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready`);
});
