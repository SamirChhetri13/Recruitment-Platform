import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

// Create a job (recruiter/admin only)
export const createJob = async (req, res, next) => {
    try {
        const job = await Job.create({
            ...req.body,
            postedBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: { job },
        });
    } catch (error) {
        next(error);
    }
};

// List jobs with search, filters and pagination
export const getJobs = async (req, res, next) => {
    try {
        const {
            search,
            location,
            jobType,
            experienceLevel,
            status = "open",
            page = 1,
            limit = 10,
        } = req.query;

        const filter = {};

        if (status) filter.status = status;
        if (location) filter.location = { $regex: location, $options: "i" };
        if (jobType) filter.jobType = jobType;
        if (experienceLevel) filter.experienceLevel = experienceLevel;
        if (search) filter.$text = { $search: search };

        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (pageNum - 1) * limitNum;

        const [jobs, total] = await Promise.all([
            Job.find(filter)
                .populate("postedBy", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Job.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                jobs,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get a single job by id
export const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate(
            "postedBy",
            "name email"
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: { job },
        });
    } catch (error) {
        next(error);
    }
};

// Update a job (only the recruiter who posted it, or admin)
export const updateJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const isOwner = job.postedBy.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this job",
            });
        }

        Object.assign(job, req.body);
        await job.save();

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: { job },
        });
    } catch (error) {
        next(error);
    }
};

// Delete a job (only the recruiter who posted it, or admin)
export const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const isOwner = job.postedBy.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this job",
            });
        }

        await job.deleteOne();
        await Application.deleteMany({ job: job._id });

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// List jobs posted by the logged-in recruiter
export const getMyJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            data: { jobs },
        });
    } catch (error) {
        next(error);
    }
};