import express from "express";
import {
  getAllUsers,
  updateUserStatus,
  getAllJobsAdmin,
  moderateJobStatus,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:userId/status", updateUserStatus);
router.get("/jobs", getAllJobsAdmin);
router.patch("/jobs/:jobId/status", moderateJobStatus);

export default router;
