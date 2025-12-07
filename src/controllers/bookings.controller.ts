import { Request, Response } from "express";
import { BookingsService } from "../services/bookings.service";
import { AuthRequest } from "../middleware/auth";

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { vehicle_id, rent_start_date, rent_end_date } = req.body;
    const booking = await BookingsService.create(user.id, Number(vehicle_id), rent_start_date, rent_end_date);
    return res.status(201).json({ success: true, message: "Booking created successfully", data: booking });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const listBookings = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const bookings = await BookingsService.listForUser(user);
    return res.status(200).json({ success: true, message: user.role === "admin" ? "Bookings retrieved successfully" : "Your bookings retrieved successfully", data: bookings });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const bookingId = Number(req.params.bookingId);
    await BookingsService.cancel(bookingId, user);
    return res.status(200).json({ success: true, message: "Booking cancelled successfully" });
  } catch (err: any) {
    if (err.message === "Forbidden") return res.status(403).json({ success: false, message: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const markReturned = async (req: AuthRequest, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    await BookingsService.markReturned(bookingId);
    return res.status(200).json({ success: true, message: "Booking marked as returned. Vehicle is now available" });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
