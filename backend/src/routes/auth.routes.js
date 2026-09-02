import express from "express";

import {
    register,
    login,
    getMe,
} from "../controllers/auth.controller.js";

import {
    registerValidation,
    loginValidation,
} from "../validations/auth.validation.js";

import {
    validateRequest,
} from "../middleware/error.middleware.js";

import {
    protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/auth/register
router.post(
    "/register",
    registerValidation,
    validateRequest,
    register
);

// POST /api/auth/login
router.post(
    "/login",
    loginValidation,
    validateRequest,
    login
);

// GET /api/auth/me
router.get(
    "/me",
    protect,
    getMe
);

export default router;