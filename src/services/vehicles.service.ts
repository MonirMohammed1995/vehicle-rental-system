import { pool } from "../config/db";

export class VehiclesService {
  static async create(payload: { vehicle_name: string; type: string; registration_number: string; daily_rent_price: number; availability_status?: string }) {
    const r = await pool.query(
      `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [payload.vehicle_name, payload.type, payload.registration_number, payload.daily_rent_price, payload.availability_status || "available"]
    );
    return r.rows[0];
  }

  static async list() {
    const r = await pool.query(`SELECT * FROM vehicles ORDER BY id`);
    return r.rows;
  }

  static async getById(id: number) {
    const r = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
    if (!r.rows.length) throw new Error("Vehicle not found");
    return r.rows[0];
  }

  static async update(id: number, payload: Partial<any>) {
    const fields: string[] = [];
    const vals: any[] = [];
    let idx = 1;
    if (payload.vehicle_name) { fields.push(`vehicle_name=$${idx++}`); vals.push(payload.vehicle_name); }
    if (payload.type) { fields.push(`type=$${idx++}`); vals.push(payload.type); }
    if (payload.registration_number) { fields.push(`registration_number=$${idx++}`); vals.push(payload.registration_number); }
    if (payload.daily_rent_price) { fields.push(`daily_rent_price=$${idx++}`); vals.push(payload.daily_rent_price); }
    if (payload.availability_status) { fields.push(`availability_status=$${idx++}`); vals.push(payload.availability_status); }

    if (!fields.length) throw new Error("No fields to update");
    vals.push(id);
    const q = `UPDATE vehicles SET ${fields.join(", ")} WHERE id=$${idx} RETURNING *`;
    const r = await pool.query(q, vals);
    return r.rows[0];
  }

  static async remove(id: number) {
    await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
  }
}
