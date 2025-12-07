import { Pool } from "pg";
import { ENV } from "./env";

export const pool = new Pool({
  connectionString: ENV.CONNECTION_STR,
});

export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin','customer')) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(150) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('car','bike','van','SUV')),
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available','booked')) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price NUMERIC NOT NULL CHECK (total_price >= 0),
        status VARCHAR(20) NOT NULL CHECK (status IN ('active','cancelled','returned')) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create default admin if none exists
    const { rows } = await pool.query(`SELECT id FROM users WHERE role='admin' LIMIT 1`);
    if (rows.length === 0) {
      const bcrypt = require("bcrypt");
      const salt = ENV.BCRYPT_SALT_ROUNDS;
      const hashed = await bcrypt.hash("admin123", salt);
      await pool.query(
        `INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5)`,
        ["Admin User", "admin@gamil.com", hashed, "0000000000", "admin"]
      );
      console.log("Default admin created: admin@gmail.com / admin1234");
    }

    console.log("DB initialized");
  } catch (err) {
    console.error("DB init error:", err);
    throw err;
  }
};
