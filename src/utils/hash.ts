import bcrypt from "bcrypt";
import { ENV } from "../config/env";

export const hashPassword = (plain: string) => {
  return bcrypt.hash(plain, ENV.BCRYPT_SALT_ROUNDS);
};

export const comparePassword = (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};
