import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary if env vars are present
const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

// Ensure local upload dir exists
const uploadsDir = path.join(process.cwd(), "uploads", "resumes");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage strategy
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `resume-${uniqueSuffix}${ext}`);
    },
});

// File filter for PDF, DOC, DOCX and max 5MB size
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/octet-stream"
    ];

    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed."), false);
    }
};

export const uploadResumeMulter = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter,
});

// Helper function to handle upload to Cloudinary or return local relative URL
export const handleResumeUpload = async (req, file) => {
    if (!file) {
        throw new Error("No resume file uploaded");
    }

    if (isCloudinaryConfigured) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "resumes",
                resource_type: "raw",
            });
            // Cleanup local file after uploading to Cloudinary
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            return result.secure_url;
        } catch (err) {
            console.error("Cloudinary upload failed, falling back to local storage:", err.message);
        }
    }

    // Fallback or default local URL
    const protocol = req.protocol || "http";
    const host = req.get("host") || "localhost:5000";
    const filename = path.basename(file.path);
    return `${protocol}://${host}/uploads/resumes/${filename}`;
};
