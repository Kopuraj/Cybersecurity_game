import express from "express"
import { query } from "../config/database.js"

const router = express.Router()

// Get top leaderboard entries
router.get("/top/:limit?", async (req, res) => {
  try {
    const limit = Number.parseInt(req.params.limit) || 10

    const leaderboard = await query(
      `SELECT 
        l.*,
        RANK() OVER (ORDER BY l.overall_score DESC, l.completed_at ASC) as global_rank
       FROM leaderboard l 
       ORDER BY l.overall_score DESC, l.completed_at ASC 
       LIMIT ?`,
      [limit],
    )

    res.json({ leaderboard })
  } catch (error) {
    console.error("[v0] Error fetching leaderboard:", error)
    res.status(500).json({ error: "Failed to fetch leaderboard" })
  }
})

// Get user rank
router.get("/rank/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params

    const userRank = await query(
      `SELECT 
        l.*,
        (SELECT COUNT(*) + 1 FROM leaderboard l2 
         WHERE l2.overall_score > l.overall_score 
         OR (l2.overall_score = l.overall_score AND l2.completed_at < l.completed_at)) as global_rank,
        (SELECT COUNT(*) FROM leaderboard) as total_players
       FROM leaderboard l 
       WHERE l.session_id = ?`,
      [sessionId],
    )

    if (userRank.length === 0) {
      return res.status(404).json({ error: "User not found in leaderboard" })
    }

    const percentile = Math.round((1 - userRank[0].global_rank / userRank[0].total_players) * 100)

    res.json({
      rank: userRank[0],
      percentile: percentile,
    })
  } catch (error) {
    console.error("[v0] Error fetching user rank:", error)
    res.status(500).json({ error: "Failed to fetch user rank" })
  }
})

// Get daily leaderboard
router.get("/daily", async (req, res) => {
  try {
    const leaderboard = await query(
      `SELECT 
        l.*,
        RANK() OVER (ORDER BY l.overall_score DESC, l.completed_at ASC) as daily_rank
       FROM leaderboard l 
       WHERE DATE(l.completed_at) = CURDATE()
       ORDER BY l.overall_score DESC, l.completed_at ASC 
       LIMIT 10`,
    )

    res.json({ leaderboard })
  } catch (error) {
    console.error("[v0] Error fetching daily leaderboard:", error)
    res.status(500).json({ error: "Failed to fetch daily leaderboard" })
  }
})

export default router
