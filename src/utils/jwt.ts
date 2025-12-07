import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const signJwt = (payload: JwtPayload, expiresIn = "1d"): string => {
  if (!ENV.JWT_SECRET) throw new Error("JWT_SECRET is missing");
  return jwt.sign(payload, ENV.JWT_SECRET as string, { expiresIn:'1d' });
};

export const verifyJwt = (token: string): JwtPayload => {
  if (!ENV.JWT_SECRET) throw new Error("JWT_SECRET is missing");
  return jwt.verify(token, ENV.JWT_SECRET as string) as JwtPayload;
};
