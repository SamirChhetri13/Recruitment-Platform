import express from "express";

const router = express.Router();

// GET /api/jobs - List all jobs
router.get("/", (req, res) => {
    res.json({
        success: true,
        data: [],
        message: "Jobs endpoint is working",
    });
});

export default router;
