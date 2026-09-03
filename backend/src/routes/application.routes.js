import express from "express";

import {
    applyToJob,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus,
    withdrawApplication,
} from "../controllers/application.controller.js";

import {
    applyJobValidation,
    updateApplicationStatusValidation,
    applicationIdValidation,
} from "../validations/application.validation.js";

import {
    validateRequest,
} from "../middleware/error.middleware.js";

import {
    protect,
    authorize,
} from "../middleware/auth.middleware.js";

// mergeParams lets this router read :jobId when mounted under /api/jobs/:jobId/applications
const jobApplicationsRouter = express.Router({ mergeParams: true });

// POST /api/jobs/:jobId/applications - Candidate applies to a job
jobApplicationsRouter.post(
    "/",
    protect,
    authorize("candidate"),
    applyJobValidation,
    validateRequest,
    applyToJob
);

// GET /api/jobs/:jobId/applications - Recruiter/admin: view applications for a job
jobApplicationsRouter.get(
    "/",
    protect,
    authorize("recruiter", "admin"),
    getApplicationsForJob
);

// Standalone router, mounted at /api/applications
const applicationsRouter = express.Router();

// GET /api/applications/me - Candidate's own applications
applicationsRouter.get(
    "/me",
    protect,
    authorize("candidate"),
    getMyApplications
);

// PATCH /api/applications/:id/status - Recruiter/admin: update application status
applicationsRouter.patch(
    "/:id/status",
    protect,
    authorize("recruiter", "admin"),
    updateApplicationStatusValidation,
    validateRequest,
    updateApplicationStatus
);

// DELETE /api/applications/:id - Candidate: withdraw application
applicationsRouter.delete(
    "/:id",
    protect,
    authorize("candidate"),
    applicationIdValidation,
    validateRequest,
    withdrawApplication
);

export { jobApplicationsRouter, applicationsRouter };