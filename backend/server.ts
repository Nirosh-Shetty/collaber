import dotenv from "dotenv";
dotenv.config(); // Load environment variables
import express from "express";
import mongoose from "mongoose";
import router from "./routes/Route";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "role"],
  })
);
app.use("/api", router);

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

app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});

import passport from "passport";
import session from "express-session";
import "./config/passport"; // this should point to the config file above

// Session (required by some strategies, even if you disable it later)
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

import cookieParser from "cookie-parser";

app.use(cookieParser());
