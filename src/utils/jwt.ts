import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const signJwt = (
  payload: JwtPayload,
  expiresIn: string = "1d"
): string => {
  return jwt.sign(payload, ENV.JWT_SECRET as string, {
    expiresIn,
  });
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, ENV.JWT_SECRET as string) as JwtPayload;
};
