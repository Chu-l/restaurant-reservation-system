import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { HttpError } from "../utils/httpError.js";

// Middleware: Verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Read token from Authorization header: Bearer <token>
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new HttpError("Not authorized, token missing", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      throw new HttpError("User not found or inactive", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      next(new HttpError("Not authorized, invalid or expired token", 401));
    } else {
      next(error);
    }
  }
};

// Middleware: Restrict access by roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new HttpError("You do not have permission to perform this action", 403);
    }
    next();
  };
};