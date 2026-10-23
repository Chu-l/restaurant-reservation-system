import { Router } from "express";
import {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} from "../controllers/reservation.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createReservationSchema,
  updateReservationSchema,
} from "../utils/reservation.schema.js";

const router = Router();

// Require authentication for all reservation routes
router.use(protect);

// Clients and admins can create reservations and view their own
router.post("/", validate(createReservationSchema), createReservation);
router.get("/", getReservations);
router.get("/:id", getReservationById);
router.put("/:id", validate(updateReservationSchema), updateReservation);

// Only admins can delete or purge reservations from the system
router.delete("/:id", restrictTo("admin"), deleteReservation);

export default router;