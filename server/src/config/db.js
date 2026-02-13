import { Pool } from "pg"  // ← Pool instead of Client
import dotenv from "dotenv"

dotenv.config()  // ← No path needed - Railway auto-loads

// Production-ready POOL
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: parseInt(process.env.PG_PORT || '5432', 10),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,  // Railway SSL
    max: 20,  // Max connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

// Test connection
pool.on('connect', () => {
    console.log("✅ PostgreSQL Pool connected")
})

pool.on('error', (err) => {
    console.error("❌ PostgreSQL Pool error:", err)
    process.exit(-1)
})

export const query = async (text, params) => {
    const client = await pool.connect()
    try {
        return await client.query(text, params)
    } finally {
        client.release()  
    }
}

export default pool
