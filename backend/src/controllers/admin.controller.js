import User from "../models/user.model.js";
import Job from "../models/job.model.js";

// List all users for admin
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 20, 1);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: { users, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } },
    });
  } catch (error) {
    next(error);
  }
};

// Toggle user active status or change role
export const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isActive, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (role && ["candidate", "recruiter", "admin"].includes(role)) user.role = role;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.name} updated successfully`,
      data: { user: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive } },
    });
  } catch (error) {
    next(error);
  }
};

// List all jobs for admin moderation
export const getAllJobsAdmin = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 20, 1);
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(filter).populate("postedBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Job.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: { jobs, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } },
    });
  } catch (error) {
    next(error);
  }
};

// Moderate job status (open/closed)
export const moderateJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (status && ["open", "closed"].includes(status)) {
      job.status = status;
    }

    await job.save();

    return res.status(200).json({
      success: true,
      message: `Job status updated to ${job.status}`,
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};
