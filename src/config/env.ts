import "dotenv/config";

export const ENV = {
  PORT: Number(process.env.PORT || 4000),
  CONNECTION_STR: process.env.CONNECTION_STR || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
};
