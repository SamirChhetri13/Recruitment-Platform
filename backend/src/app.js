import express from "express";

import jobRoutes from "./routes/job.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { applicationsRouter } from "./routes/application.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationsRouter);

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