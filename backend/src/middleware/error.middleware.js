import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    let message = err.message || "Internal Server Error";

    // Invalid MongoDB ObjectId (e.g. malformed id in a route param)
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid value for field '${err.path}'`;
    }

    // Mongoose schema validation failed
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(", ");
    }

    // Duplicate key error (e.g. unique email, or duplicate job+candidate application)
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0];
        message = field ? `Duplicate value for field '${field}'` : "Duplicate value error";
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};