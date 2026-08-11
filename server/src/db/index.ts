import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "../config/env.config.js";
import * as schema from "./schema.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Database connected successfully ✅");
});

pool.on("error", (err) => {
  console.log("Error connecting to database ❌");
});

export const db = drizzle({ client: pool, schema });
