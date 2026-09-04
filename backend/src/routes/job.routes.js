import express from "express";
import { createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs } from "../controllers/job.controller.js";
import { createJobValidation, updateJobValidation, jobIdValidation } from "../validations/job.validation.js";
import { validateRequest } from "../middleware/error.middleware.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { jobApplicationsRouter } from "./application.routes.js";

const router = express.Router();

// Nested route: /api/jobs/:jobId/applications
router.use("/:jobId/applications", jobApplicationsRouter);

router.get("/", getJobs);
router.get("/mine", protect, authorize("recruiter", "admin"), getMyJobs);
router.get("/:id", jobIdValidation, validateRequest, getJobById);
router.post("/", protect, authorize("recruiter", "admin"), createJobValidation, validateRequest, createJob);
router.patch("/:id", protect, authorize("recruiter", "admin"), updateJobValidation, validateRequest, updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin"), jobIdValidation, validateRequest, deleteJob);

export default router;