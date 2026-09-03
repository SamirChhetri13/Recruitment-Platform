import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Job description is required"],
        },
        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        jobType: {
            type: String,
            enum: ["full-time", "part-time", "contract", "internship", "remote"],
            default: "full-time",
        },
        skills: {
            type: [String],
            default: [],
        },
        salaryMin: {
            type: Number,
        },
        salaryMax: {
            type: Number,
        },
        experienceLevel: {
            type: String,
            enum: ["entry", "mid", "senior", "lead"],
            default: "entry",
        },
        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open",
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

jobSchema.index({ title: "text", description: "text", skills: "text" });

const Job = mongoose.model("Job", jobSchema);

export default Job;
