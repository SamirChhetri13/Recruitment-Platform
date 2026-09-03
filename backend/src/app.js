import express from "express";

import jobRoutes from "./routes/job.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { applicationsRouter } from "./routes/application.routes.js";

import {
    errorHandler,
} from "./middleware/error.middleware.js";

const app = express();

// Global middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationsRouter);

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "Recruitment Platform API is running",
    });
});

// Error handling middleware
app.use(errorHandler);

export default app;