import { config } from "dotenv";

config({ quiet: true });

export const env = {
  PORT: process.env.PORT || 5001,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.PORT,
  CLIENT_URL: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default env;
