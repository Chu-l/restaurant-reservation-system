import express from "express";
import cors from "cors";
import "dotenv/config";
import rateLimit from "express-rate-limit";

// Route Imports
import userRoutes from "./routes/user.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";

// Error Middleware Imports
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Security: CORS Configuration
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());

// Security: Rate Limiting Configuration
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: "Too many requests. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 authentication attempts
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again in 15 minutes.",
  },
});

// Apply Rate Limiters
app.use("/api", globalLimiter);
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

// Root Endpoint / Welcome message
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to Lien Resto API",
    documentation: "/api",
  });
});

// API Information Endpoint
app.get("/api", (_req, res) => {
  res.json({
    success: true,
    message: "Lien Resto - Reservation System REST API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      reservations: "/api/reservations",
    },
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;