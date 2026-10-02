import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import jobRoutes from "./routes/job.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { applicationsRouter } from "./routes/application.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS Configuration
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// Cookie Parser & Body Parsers
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Rate Limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs on auth routes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many authentication attempts, please try again later." },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP, please try again later." },
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/jobs", apiLimiter, jobRoutes);
app.use("/api/applications", apiLimiter, applicationsRouter);
app.use("/api/admin", apiLimiter, adminRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Recruitment Platform API is running" });
});

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use(errorHandler);

export default app;