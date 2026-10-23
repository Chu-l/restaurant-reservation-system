import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/user.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createUserSchema, updateUserSchema } from "../utils/user.schema.js";

const router = Router();

// Public Authentication Endpoints
router.post("/register", validate(createUserSchema), createUser);
router.post("/login", loginUser);

// Protect all routes below this line
router.use(protect);

// Admin-only User Management Endpoints
router.use(restrictTo("admin"));

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;