import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation,
  changePasswordValidation,
} from "../validations/auth.validation.js";
import { validateRequest } from "../middleware/error.middleware.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPasswordValidation, validateRequest, forgotPassword);
router.post("/reset-password", resetPasswordValidation, validateRequest, resetPassword);

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfileValidation, validateRequest, updateProfile);
router.put("/change-password", protect, changePasswordValidation, validateRequest, changePassword);

export default router;