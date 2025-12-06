import { pool } from "../config/db";
import { hashPassword, comparePassword } from "../utils/hash";
import { signJwt } from "../utils/jwt";
import { User } from "../models/User";

export class AuthService {
  static async signup(data: { name: string; email: string; password: string; phone: string; role?: string }) {
    const email = String(data.email).toLowerCase();
    const existing = await pool.query(`SELECT id FROM users WHERE email=$1`, [email]);
    if (existing.rows.length) throw new Error("Email already in use");

    if (String(data.password).length < 6) throw new Error("Password must be at least 6 characters");

    const hashed = await hashPassword(data.password);
    const r = await pool.query(
      `INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,role`,
      [data.name, email, hashed, data.phone, data.role === "admin" ? "admin" : "customer"]
    );
    const user: User = r.rows[0] as any;
    const token = signJwt({ id: user.id, email: user.email, role: user.role });
    return { user, token };
  }

  static async signin(emailIn: string, password: string) {
    const email = String(emailIn).toLowerCase();
    const r = await pool.query(`SELECT id,name,email,password,role FROM users WHERE email=$1`, [email]);
    if (!r.rows.length) throw new Error("Invalid credentials");
    const user = r.rows[0] as any;
    const ok = await comparePassword(password, user.password);
    if (!ok) throw new Error("Invalid credentials");
    const token = signJwt({ id: user.id, email: user.email, role: user.role });
    // don't return password
    delete user.password;
    return { user, token };
  }
}
