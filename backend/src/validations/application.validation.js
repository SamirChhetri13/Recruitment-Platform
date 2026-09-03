import { body, param } from "express-validator";

export const applyJobValidation = [
    param("jobId").isMongoId().withMessage("Invalid job id"),
    body("resumeUrl")
        .trim()
        .notEmpty()
        .withMessage("Resume URL is required"),
    body("coverLetter").optional().trim(),
];

export const updateApplicationStatusValidation = [
    param("id").isMongoId().withMessage("Invalid application id"),
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["applied", "shortlisted", "rejected", "hired"])
        .withMessage("Status must be applied, shortlisted, rejected, or hired"),
];

export const applicationIdValidation = [
    param("id").isMongoId().withMessage("Invalid application id"),
];
