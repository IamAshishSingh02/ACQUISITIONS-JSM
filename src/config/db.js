import 'dotenv/config'
import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// Configure Neon for local development with Neon Local proxy
// Neon Local only supports HTTP-based communication, not websockets
if (process.env.NEON_LOCAL === 'true') {
  // Extract hostname from NEON_URI for Neon Local
  const url = new URL(process.env.NEON_URI.replace('postgres://', 'http://'))
  neonConfig.fetchEndpoint = `http://${url.host}/sql`
  neonConfig.useSecureWebSocket = false
  neonConfig.poolQueryViaFetch = true
}

const sql = neon(process.env.NEON_URI)
const db = drizzle(sql)

export { db, sql }
