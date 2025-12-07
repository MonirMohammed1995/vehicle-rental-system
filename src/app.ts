import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import vehiclesRoutes from "./routes/vehicles.routes";
import bookingsRoutes from "./routes/bookings.routes";

const app = express();
app.use(express.json());

// Root route (main home route)
app.get("/", (req : Request, res: Response) => {
  res.json({
    status: "success",
    message: "Vehicle Rental API is running successfully!",
    version: "v1",
    endpoints: {
      auth: "/api/v1/auth",
      users: "/api/v1/users",
      vehicles: "/api/v1/vehicles",
      bookings: "/api/v1/bookings",
      health: "/health"
    }
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/bookings", bookingsRoutes);

// Health Check
app.get("/health", (req, res) => res.json({ ok: true }));

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
