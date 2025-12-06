import { pool } from "../config/db";
import { hashPassword } from "../utils/hash";

export class UsersService {
  static async listAll() {
    const r = await pool.query(`SELECT id,name,email,phone,role,created_at FROM users ORDER BY id`);
    return r.rows;
  }

  static async getById(id: number) {
    const r = await pool.query(`SELECT id,name,email,phone,role,created_at FROM users WHERE id=$1`, [id]);
    if (!r.rows.length) throw new Error("User not found");
    return r.rows[0];
  }

  static async update(requester: { id: number; role: string }, id: number, payload: Partial<any>) {
    // permission check
    if (requester.role !== "admin" && requester.id !== id) throw new Error("Forbidden");

    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (payload.name) { fields.push(`name=$${idx++}`); values.push(payload.name); }
    if (payload.email) { fields.push(`email=$${idx++}`); values.push(String(payload.email).toLowerCase()); }
    if (payload.phone) { fields.push(`phone=$${idx++}`); values.push(payload.phone); }
    if (payload.password) {
      if (String(payload.password).length < 6) throw new Error("Password must be at least 6 chars");
      const hashed = await hashPassword(payload.password);
      fields.push(`password=$${idx++}`); values.push(hashed);
    }
    if (payload.role && requester.role === "admin") { fields.push(`role=$${idx++}`); values.push(payload.role); }

    if (!fields.length) throw new Error("No fields to update");

    values.push(id);
    const q = `UPDATE users SET ${fields.join(", ")} WHERE id=$${idx} RETURNING id,name,email,phone,role,created_at`;
    const r = await pool.query(q, values);
    return r.rows[0];
  }

  static async remove(id: number) {
    await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  }
}
