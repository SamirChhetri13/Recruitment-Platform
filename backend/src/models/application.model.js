import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        resumeUrl: {
            type: String,
            required: [true, "Resume URL is required"],
        },
        coverLetter: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["applied", "shortlisted", "rejected", "hired"],
            default: "applied",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent a candidate from applying to the same job twice
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;