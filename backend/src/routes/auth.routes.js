import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { registerValidation, loginValidation } from "../validations/auth.validation.js";
import { validateRequest } from "../middleware/error.middleware.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.get("/me", protect, getMe);

export default router;