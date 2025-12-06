import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password || !phone) return res.status(400).json({ message: "Missing fields" });
    const result = await AuthService.signup({ name, email, password, phone, role });
    return res.status(201).json(result);
  } catch (err: any) {
    if (err.message.includes("Email already")) return res.status(400).json({ message: err.message });
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });
    const result = await AuthService.signin(email, password);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(401).json({ message: err.message || "Invalid credentials" });
  }
};
