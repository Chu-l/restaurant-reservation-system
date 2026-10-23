import mongoose from "mongoose";
import { Reservation } from "../models/reservation.model.js";
import { User } from "../models/user.model.js";
import { HttpError } from "../utils/httpError.js";

export const createReservation = async (reservationData) => {
  if (!mongoose.Types.ObjectId.isValid(reservationData.user)) {
    throw new HttpError("Invalid user ID format", 400);
  }

  const userExists = await User.findById(reservationData.user);
  if (!userExists) {
    throw new HttpError("User specified for reservation does not exist", 404);
  }

  const newReservation = await Reservation.create(reservationData);
  return await newReservation.populate("user", "name email");
};

export const getAllReservations = async (currentUser) => {
  // If user is client, return only their own reservations
  const filter = currentUser.role === "client" ? { user: currentUser._id } : {};

  return await Reservation.find(filter).populate("user", "name email");
};

export const getReservationById = async (id, currentUser) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError("Invalid reservation ID format", 400);
  }

  const reservation = await Reservation.findById(id).populate("user", "name email");
  if (!reservation) {
    throw new HttpError("Reservation not found", 404);
  }

  // Ownership check: Clients can only access their own reservations
  if (currentUser.role === "client" && reservation.user._id.toString() !== currentUser._id.toString()) {
    throw new HttpError("You do not have permission to access this reservation", 403);
  }

  return reservation;
};

export const updateReservation = async (id, updateData, currentUser) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError("Invalid reservation ID format", 400);
  }

  const reservation = await Reservation.findById(id);
  if (!reservation) {
    throw new HttpError("Reservation not found", 404);
  }

  // Ownership check: Clients can only update their own reservations
  if (currentUser.role === "client" && reservation.user.toString() !== currentUser._id.toString()) {
    throw new HttpError("You do not have permission to update this reservation", 403);
  }

  // Validate user ID if explicitly updated by an admin
  if (updateData.user) {
    if (!mongoose.Types.ObjectId.isValid(updateData.user)) {
      throw new HttpError("Invalid user ID format", 400);
    }
    const userExists = await User.findById(updateData.user);
    if (!userExists) {
      throw new HttpError("User specified for reservation does not exist", 404);
    }
  }

  const updatedReservation = await Reservation.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("user", "name email");

  return updatedReservation;
};

export const deleteReservation = async (id, currentUser) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError("Invalid reservation ID format", 400);
  }

  const reservation = await Reservation.findById(id);
  if (!reservation) {
    throw new HttpError("Reservation not found", 404);
  }

  // Ownership check: Clients can only delete/cancel their own reservations
  if (currentUser.role === "client" && reservation.user.toString() !== currentUser._id.toString()) {
    throw new HttpError("You do not have permission to delete this reservation", 403);
  }

  await Reservation.findByIdAndDelete(id);
  return { message: "Reservation deleted successfully" };
};