import "dotenv/config";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

let sql = null;
let db = null;

/* ✅ Skip DB connection during Jest tests */
if (process.env.NODE_ENV === "test") {
  console.warn("⚠️ Database connection skipped in test mode");
} else {
  /* ✅ Ensure NEON_URI exists */
  if (!process.env.NEON_URI) {
    throw new Error("❌ NEON_URI is missing. Please set it in your env file.");
  }

  /* ✅ Neon Local Proxy Support */
  if (process.env.NEON_LOCAL === "true") {
    console.log("✅ Neon Local enabled: Using local proxy endpoint");

    const url = new URL(process.env.NEON_URI.replace("postgres://", "http://"));

    neonConfig.fetchEndpoint = `http://${url.host}/sql`;
    neonConfig.useSecureWebSocket = false;
    neonConfig.poolQueryViaFetch = true;
  }

  /* ✅ Create SQL + DB Instance */
  sql = neon(process.env.NEON_URI);
  db = drizzle(sql);
}

export { db, sql };