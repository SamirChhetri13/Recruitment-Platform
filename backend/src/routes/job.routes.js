import express from "express";

import {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
} from "../controllers/job.controller.js";

import {
    createJobValidation,
    updateJobValidation,
    jobIdValidation,
} from "../validations/job.validation.js";

import {
    validateRequest,
} from "../middleware/error.middleware.js";

import {
    protect,
    authorize,
} from "../middleware/auth.middleware.js";

import { jobApplicationsRouter } from "./application.routes.js";

const router = express.Router();

// Nested route: /api/jobs/:jobId/applications
router.use("/:jobId/applications", jobApplicationsRouter);

// GET /api/jobs - List all jobs (public, supports search/filter/pagination)
router.get("/", getJobs);

// GET /api/jobs/mine - Jobs posted by the logged-in recruiter
router.get(
    "/mine",
    protect,
    authorize("recruiter", "admin"),
    getMyJobs
);

// GET /api/jobs/:id - Get a single job
router.get(
    "/:id",
    jobIdValidation,
    validateRequest,
    getJobById
);

// POST /api/jobs - Create a job
router.post(
    "/",
    protect,
    authorize("recruiter", "admin"),
    createJobValidation,
    validateRequest,
    createJob
);

// PATCH /api/jobs/:id - Update a job
router.patch(
    "/:id",
    protect,
    authorize("recruiter", "admin"),
    updateJobValidation,
    validateRequest,
    updateJob
);

// DELETE /api/jobs/:id - Delete a job
router.delete(
    "/:id",
    protect,
    authorize("recruiter", "admin"),
    jobIdValidation,
    validateRequest,
    deleteJob
);

export default router;