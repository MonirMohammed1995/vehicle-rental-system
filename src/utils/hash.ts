import bcrypt from "bcrypt";
import { ENV } from "../config/env";

export const hashPassword = (plain: string) => {
  return bcrypt.hash(plain, ENV.BCRYPT_SALT_ROUNDS);
};

export const comparePassword = (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed);
};
