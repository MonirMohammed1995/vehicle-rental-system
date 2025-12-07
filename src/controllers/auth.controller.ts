import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const result = await AuthService.signup({ name, email, password, phone, role });
    return res.status(201).json({ success: true, message: "User registered successfully", data: result.user, token: result.token });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.signin(email, password);
    return res.status(200).json({ success: true, message: "Login successful", data: result });
  } catch (err: any) {
    return res.status(401).json({ success: false, message: err.message });
  }
};
