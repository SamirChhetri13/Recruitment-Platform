import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import { handleResumeUpload } from "../middleware/upload.middleware.js";

/**
 * Calculates match percentage and identifies matched/missing skills between job and candidate.
 * @param {Array<string>} jobSkills - Skills required by the job vacancy
 * @param {Array<string>} candidateSkills - Skills possessed by the candidate
 * @returns {{ matchScore: number, matchedSkills: Array<string>, missingSkills: Array<string> }}
 */
export const calculateMatchScore = (jobSkills = [], candidateSkills = []) => {
    const rawJobSkills = Array.isArray(jobSkills) ? jobSkills : [];
    const rawCandidateSkills = Array.isArray(candidateSkills) ? candidateSkills : [];

    // Filter out empty or whitespace-only items
    const validJobSkills = rawJobSkills.map((s) => String(s).trim()).filter(Boolean);
    const validCandidateSkills = rawCandidateSkills.map((s) => String(s).trim()).filter(Boolean);

    // If the job specified no required skills, treat as 100% match
    if (validJobSkills.length === 0) {
        return {
            matchScore: 100,
            matchedSkills: validCandidateSkills,
            missingSkills: [],
        };
    }

    const normalizedCandidateSet = new Set(
        validCandidateSkills.map((s) => s.toLowerCase())
    );

    const matchedSkills = [];
    const missingSkills = [];

    validJobSkills.forEach((skill) => {
        if (normalizedCandidateSet.has(skill.toLowerCase())) {
            matchedSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }
    });

    const matchScore = Math.round((matchedSkills.length / validJobSkills.length) * 100);

    return {
        matchScore,
        matchedSkills,
        missingSkills,
    };
};

// Upload candidate resume file
export const uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a resume file (PDF, DOC, or DOCX, max 5MB)" });
        }
        const resumeUrl = await handleResumeUpload(req, req.file);
        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            data: { resumeUrl, fileName: req.file.originalname }
        });
    } catch (error) {
        next(error);
    }
};

// Candidate applies to a job
export const applyToJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const { resumeUrl, coverLetter, skills, experience } = req.body;

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

        // Fetch candidate user to pull profile skills and experience if not provided directly
        const candidateUser = await User.findById(req.user._id);
        const resolvedSkills = (Array.isArray(skills) && skills.length > 0)
            ? skills
            : (candidateUser?.skills || []);
        const resolvedExperience = experience || candidateUser?.experience || "";

        const application = await Application.create({
            job: jobId,
            candidate: req.user._id,
            resumeUrl,
            coverLetter,
            skills: resolvedSkills,
            experience: resolvedExperience,
        });

        return res.status(201).json({ success: true, message: "Application submitted successfully", data: { application } });
    } catch (error) {
        next(error);
    }
};

// Candidate: view own applications
export const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ candidate: req.user._id })
            .populate("job", "title company location status skills")
            .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: { applications } });
    } catch (error) {
        next(error);
    }
};

// Recruiter/admin: view all applications for a specific job they own with calculated skill match
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
            .populate("candidate", "name email avatar skills experience")
            .populate("job", "title skills")
            .sort({ createdAt: -1 });

        const applicationsWithScores = applications.map((app) => {
            const appObj = app.toObject();
            const candidate = app.candidate || {};

            // Prioritize candidate user profile skills, fallback to application snapshot skills
            const candidateSkills = (Array.isArray(candidate.skills) && candidate.skills.length > 0)
                ? candidate.skills
                : (Array.isArray(app.skills) ? app.skills : []);

            const candidateExperience = candidate.experience || app.experience || "";

            const { matchScore, matchedSkills, missingSkills } = calculateMatchScore(
                job.skills || [],
                candidateSkills
            );

            return {
                ...appObj,
                matchScore,
                matchedSkills,
                missingSkills,
                candidate: {
                    ...candidate,
                    skills: candidateSkills,
                    experience: candidateExperience,
                },
            };
        });

        return res.status(200).json({ success: true, data: { applications: applicationsWithScores } });
    } catch (error) {
        next(error);
    }
};

// Recruiter/admin: update an application's status
export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id)
            .populate("job", "title skills postedBy")
            .populate("candidate", "name email avatar skills experience");

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        const isOwner = application.job.postedBy.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "You do not have permission to update this application" });
        }

        application.status = status;
        await application.save();

        const candidate = application.candidate || {};
        const candidateSkills = (Array.isArray(candidate.skills) && candidate.skills.length > 0)
            ? candidate.skills
            : (Array.isArray(application.skills) ? application.skills : []);

        const { matchScore, matchedSkills, missingSkills } = calculateMatchScore(
            application.job?.skills || [],
            candidateSkills
        );

        const appObj = application.toObject();

        return res.status(200).json({
            success: true,
            message: "Application status updated",
            data: {
                application: {
                    ...appObj,
                    matchScore,
                    matchedSkills,
                    missingSkills,
                    candidate: {
                        ...candidate,
                        skills: candidateSkills,
                        experience: candidate.experience || application.experience || "",
                    },
                },
            },
        });
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