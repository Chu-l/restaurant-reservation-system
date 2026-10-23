import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { HttpError } from "../utils/httpError.js";

//Helper function to generate JWT tokens for users
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );
};

export const createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new HttpError("User with this email already exists", 400);
  }

  // Mongoose automatically hashes the password via pre("save") hook
  const newUser = await User.create(userData);

  // Generate token on registration so the user is authenticated immediately
  const token = generateToken(newUser);

  return {
    user: newUser, // toJSON() automatically removes password from response
    token,
  };
};

export const loginUserService = async ({ email, password }) => {
  // Explicitly request +password since select: false hides it by default in schema
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new HttpError("Invalid credentials", 401);
  }

  // Use schema method to compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new HttpError("Invalid credentials", 401);
  }

  // Generate JWT token
  const token = generateToken(user);

  return {
    user, // toJSON() automatically hides password
    token,
  };
};

export const getAllUsers = async () => {
  return await User.find({});
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new HttpError("User not found", 404);
  }
  return user;
};

export const updateUser = async (id, updateData) => {
  const user = await User.findById(id);
  if (!user) {
    throw new HttpError("User not found", 404);
  }

  // Assign update fields and save to trigger pre("save") if password is modified
  Object.assign(user, updateData);
  await user.save();

  return user;
};

export const deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new HttpError("User not found", 404);
  }
  return { message: "User deleted successfully" };
};