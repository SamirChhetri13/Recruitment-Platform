import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

// Candidate applies to a job
export const applyToJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const { resumeUrl, coverLetter } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        if (job.status !== "open") {
            return res.status(400).json({ success: false, message: "This job is no longer accepting applications" });
        }

        const existingApplication = await Application.findOne({ job: jobId, candidate: req.user._id });
        if (existingApplication) {
            return res.status(409).json({ success: false, message: "You have already applied to this job" });
        }

        const application = await Application.create({ job: jobId, candidate: req.user._id, resumeUrl, coverLetter });
        return res.status(201).json({ success: true, message: "Application submitted successfully", data: { application } });
    } catch (error) {
        next(error);
    }
};

// Candidate: view own applications
export const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ candidate: req.user._id })
            .populate("job", "title company location status")
            .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: { applications } });
    } catch (error) {
        next(error);
    }
};

// Recruiter/admin: view all applications for a specific job they own
export const getApplicationsForJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const isOwner = job.postedBy.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "You do not have permission to view these applications" });
        }

        const applications = await Application.find({ job: jobId })
            .populate("candidate", "name email")
            .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: { applications } });
    } catch (error) {
        next(error);
    }
};

// Recruiter/admin: update an application's status
export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate("job");
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        const isOwner = application.job.postedBy.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "You do not have permission to update this application" });
        }

        application.status = status;
        await application.save();

        return res.status(200).json({ success: true, message: "Application status updated", data: { application } });
    } catch (error) {
        next(error);
    }
};

// Candidate: withdraw own application
export const withdrawApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        const isOwner = application.candidate.toString() === req.user._id.toString();
        if (!isOwner) {
            return res.status(403).json({ success: false, message: "You do not have permission to withdraw this application" });
        }

        await application.deleteOne();
        return res.status(200).json({ success: true, message: "Application withdrawn successfully" });
    } catch (error) {
        next(error);
    }
};