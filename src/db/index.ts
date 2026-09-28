import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { envValid } from "@/lib/envValid";

const sql = neon(envValid.NEON_DB_SECRET_KEY);
export const db = drizzle(sql, { schema });
