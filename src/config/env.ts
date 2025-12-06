import "dotenv/config";

export const ENV = {
  PORT: Number(process.env.PORT || 3000),
  CONNECTION_STR: process.env.CONNECTION_STR || "",
  JWT_SECRET: process.env.JWT_SECRET || "changeme",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
};
