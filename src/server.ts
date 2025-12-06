import express, { Request, Response, NextFunction } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.CONNECTION_STR,
});
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        model VARCHAR(100),
        plate_no VARCHAR(50) UNIQUE,
        is_available BOOLEAN DEFAULT true
      );

      CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        vehicle_id INT REFERENCES vehicles(id),
        start_date DATE,
        end_date DATE,
        total_cost NUMERIC
      );
    `);

    console.log("Database Initialized Successfully");
  } catch (error) {
    console.error("DB Init Error:", error);
  }
};

app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Rental API is Running!");
});

app.post("/", (req: Request, res: Response) => {
  console.log("Received Body:", req.body);

  res.status(201).json({
    success: true,
    message: "POST request received!",
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Server Error:", err);
  return res.status(500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(port, async () => {
  await initDB();
  console.log(`Server running on port ${port}`);
});
