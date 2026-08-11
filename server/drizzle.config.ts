import { defineConfig } from "drizzle-kit";
import env from "./src/config/env.config.js";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./server/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});