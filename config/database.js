import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

// Create connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cybersafe_quest",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})

// Test database connection
pool
  .getConnection()
  .then((connection) => {
    console.log("[v0] Database connected successfully")
    connection.release()
  })
  .catch((err) => {
    console.error("[v0] Database connection failed:", err.message)
  })

// Helper function to execute queries
export const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("[v0] Query error:", error.message)
    throw error
  }
}
