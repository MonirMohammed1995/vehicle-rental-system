import express from "express";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import vehiclesRoutes from "./routes/vehicles.routes";
import bookingsRoutes from "./routes/bookings.routes";

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/bookings", bookingsRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

// global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);
  return res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

export default app;
