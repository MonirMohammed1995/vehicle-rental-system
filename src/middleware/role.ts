import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export const authorize = (roles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (roles.length && !roles.includes(user.role)) return res.status(403).json({ success: false, message: "Forbidden" });
    next();
  };
};
