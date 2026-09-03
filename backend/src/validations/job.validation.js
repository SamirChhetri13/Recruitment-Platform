import { body, param } from "express-validator";

export const createJobValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Job title is required"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Job description is required"),
    body("company")
        .trim()
        .notEmpty()
        .withMessage("Company name is required"),
    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required"),
    body("jobType")
        .optional()
        .isIn(["full-time", "part-time", "contract", "internship", "remote"])
        .withMessage("Invalid job type"),
    body("experienceLevel")
        .optional()
        .isIn(["entry", "mid", "senior", "lead"])
        .withMessage("Invalid experience level"),
    body("skills")
        .optional()
        .isArray()
        .withMessage("Skills must be an array of strings"),
    body("salaryMin")
        .optional()
        .isNumeric()
        .withMessage("salaryMin must be a number"),
    body("salaryMax")
        .optional()
        .isNumeric()
        .withMessage("salaryMax must be a number"),
];

export const updateJobValidation = [
    param("id").isMongoId().withMessage("Invalid job id"),
    body("title").optional().trim().notEmpty().withMessage("Job title cannot be empty"),
    body("description").optional().trim().notEmpty().withMessage("Job description cannot be empty"),
    body("company").optional().trim().notEmpty().withMessage("Company name cannot be empty"),
    body("location").optional().trim().notEmpty().withMessage("Location cannot be empty"),
    body("jobType")
        .optional()
        .isIn(["full-time", "part-time", "contract", "internship", "remote"])
        .withMessage("Invalid job type"),
    body("status")
        .optional()
        .isIn(["open", "closed"])
        .withMessage("Status must be open or closed"),
];

export const jobIdValidation = [
    param("id").isMongoId().withMessage("Invalid job id"),
];