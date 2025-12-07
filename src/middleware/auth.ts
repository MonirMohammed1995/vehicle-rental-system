import { Request, Response, NextFunction } from "express";
import { verifyJwt, JwtPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ success: false, message: "Missing Authorization header" });

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ success: false, message: "Invalid Authorization format" });

  const token = parts[1];
if (!token) {
  return res.status(401).json({ success: false, message: "Token missing" });
}

try {
  const payload = verifyJwt(token);
  req.user = payload;
  next();
} catch (err) {
  return res.status(401).json({ success: false, message: "Invalid or expired token" });
}

};
