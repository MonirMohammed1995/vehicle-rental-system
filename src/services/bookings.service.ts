import { pool } from "../config/db";

function dateOnly(dateStr: string) {
  return new Date(dateStr + "T00:00:00");
}

export class BookingsService {
  static async create(customerId: number, vehicleId: number, rentStart: string, rentEnd: string) {
    const vq = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId]);
    if (!vq.rows.length) throw new Error("Vehicle not found");
    const vehicle = vq.rows[0];
    if (vehicle.availability_status !== "available") throw new Error("Vehicle not available");

    const start = dateOnly(rentStart);
    const end = dateOnly(rentEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) throw new Error("rent_end_date must be after start date");

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const total_price = Number(vehicle.daily_rent_price) * days;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const br = await client.query(
        `INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,'active') RETURNING *`,
        [customerId, vehicleId, rentStart, rentEnd, total_price]
      );
      await client.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [vehicleId]);
      await client.query("COMMIT");
      return br.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  static async listForUser(user: { id: number; role: string }) {
    if (user.role === "admin") {
      const r = await pool.query(`SELECT * FROM bookings ORDER BY id`);
      return r.rows;
    } else {
      const r = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1 ORDER BY id`, [user.id]);
      return r.rows;
    }
  }

  static async cancel(bookingId: number, requester: { id: number; role: string }) {
    const r = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
    if (!r.rows.length) throw new Error("Booking not found");
    const booking = r.rows[0];

    if (requester.role !== "admin" && booking.customer_id !== requester.id) throw new Error("Forbidden");
    if (new Date() >= new Date(booking.rent_start_date)) throw new Error("Cannot cancel after start date");

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`UPDATE bookings SET status='cancelled' WHERE id=$1`, [bookingId]);
      await client.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);
      await client.query("COMMIT");
      return { success: true };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  static async markReturned(bookingId: number) {
    const r = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
    if (!r.rows.length) throw new Error("Booking not found");
    const booking = r.rows[0];

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [bookingId]);
      await client.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);
      await client.query("COMMIT");
      return { success: true };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}
