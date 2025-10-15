import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { pool } from "./config/database.js"
import userRoutes from "./routes/userRoutes.js"
import gameRoutes from "./routes/gameRoutes.js"
import achievementRoutes from "./routes/achievementRoutes.js"
import leaderboardRoutes from "./routes/leaderboardRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CyberSafe Quest API is running",
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use("/api/users", userRoutes)
app.use("/api/game", gameRoutes)
app.use("/api/achievements", achievementRoutes)
app.use("/api/leaderboard", leaderboardRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.stack)
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal server error",
      status: err.status || 500,
    },
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      status: 404,
    },
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`[v0] CyberSafe Quest API server running on port ${PORT}`)
  console.log(`[v0] Environment: ${process.env.NODE_ENV}`)
  console.log(`[v0] CORS enabled for: ${process.env.CORS_ORIGIN}`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[v0] SIGTERM received, closing server...")
  pool.end()
  process.exit(0)
})
