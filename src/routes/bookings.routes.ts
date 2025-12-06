import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { authorize } from "../middleware/role";
import { createBooking, listBookings, cancelBooking, markReturned } from "../controllers/bookings.controller";

const router = Router();
router.post("/", authMiddleware, authorize(["customer","admin"]), createBooking);
router.get("/", authMiddleware, listBookings);
router.put("/:bookingId", authMiddleware, authorize(["customer","admin"]), cancelBooking);
router.put("/:bookingId/return", authMiddleware, authorize(["admin"]), markReturned);

export default router;
