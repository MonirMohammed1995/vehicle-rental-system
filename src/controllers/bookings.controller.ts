import { Request, Response } from "express";
import { BookingsService } from "../services/bookings.service";
import { AuthRequest } from "../middleware/auth";

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { vehicle_id, rent_start_date, rent_end_date } = req.body;
    if (!vehicle_id || !rent_start_date || !rent_end_date) return res.status(400).json({ message: "Missing fields" });

    const booking = await BookingsService.create(user.id, Number(vehicle_id), rent_start_date, rent_end_date);
    return res.status(201).json(booking);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const listBookings = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const bookings = await BookingsService.listForUser(user);
    return res.status(200).json(bookings);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const bookingId = Number(req.params.bookingId);
    await BookingsService.cancel(bookingId, user);
    return res.status(200).json({ message: "Booking cancelled" });
  } catch (err: any) {
    if (err.message === "Forbidden") return res.status(403).json({ message: err.message });
    return res.status(400).json({ message: err.message });
  }
};

export const markReturned = async (req: AuthRequest, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    await BookingsService.markReturned(bookingId);
    return res.status(200).json({ message: "Booking marked returned" });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
