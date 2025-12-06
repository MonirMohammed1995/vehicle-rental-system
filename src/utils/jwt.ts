import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const signJwt = (payload: object, expiresIn = "1d") => {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
};
