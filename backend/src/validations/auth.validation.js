import { body } from "express-validator";

export const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("role")
        .optional()
        .isIn(["candidate", "recruiter", "admin"])
        .withMessage("Role must be candidate, recruiter, or admin"),
];

export const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

export const forgotPasswordValidation = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
];

export const resetPasswordValidation = [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long"),
];

export const updateProfileValidation = [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("avatar").optional().trim(),
];

export const changePasswordValidation = [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long"),
];

