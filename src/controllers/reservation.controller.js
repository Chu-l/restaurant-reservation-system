import * as reservationService from "../services/reservation.service.js";

export const createReservation = async (req, res, next) => {
  try {
    // Assign authenticated user ID if not explicitly provided in request body
    const reservationData = {
      ...req.body,
      user: req.body.user || req.user._id,
    };

    const reservation = await reservationService.createReservation(reservationData);
    
    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservations = async (req, res, next) => {
  try {
    // Pass req.user so service filters by role (client sees own, admin sees all)
    const reservations = await reservationService.getAllReservations(req.user);
    
    res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservationById = async (req, res, next) => {
  try {
    // Pass req.user to verify ownership/permission
    const reservation = await reservationService.getReservationById(
      req.params.id,
      req.user
    );
    
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReservation = async (req, res, next) => {
  try {
    // Pass req.user to restrict non-admin updates
    const updatedReservation = await reservationService.updateReservation(
      req.params.id,
      req.body,
      req.user
    );
    
    res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      data: updatedReservation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReservation = async (req, res, next) => {
  try {
    // Pass req.user to restrict non-admin deletions
    const result = await reservationService.deleteReservation(
      req.params.id,
      req.user
    );
    
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};