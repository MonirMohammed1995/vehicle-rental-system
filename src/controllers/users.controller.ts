import { Request, Response } from "express";
import { UsersService } from "../services/users.service";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/auth";

export const listUsers = async (req: Request, res: Response) => {
  try {
    const rows = await UsersService.listAll();
    return res.status(200).json(rows);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const row = await UsersService.getById(user.id);
    return res.status(200).json(row);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const userId = Number(req.params.userId);
    const updated = await UsersService.update(user, userId, req.body);
    return res.status(200).json(updated);
  } catch (err: any) {
    if (err.message === "Forbidden") return res.status(403).json({ message: err.message });
    if (err.message === "No fields to update") return res.status(400).json({ message: err.message });
    if (err.code === "23505") return res.status(400).json({ message: "Email already in use" });
    return res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { rows } = await pool.query(`SELECT id FROM bookings WHERE customer_id=$1 AND status='active' LIMIT 1`, [userId]);
    if (rows.length) return res.status(400).json({ message: "User has active bookings" });
    await UsersService.remove(Number(userId));
    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
