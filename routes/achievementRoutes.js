import express from "express"
import { query } from "../config/database.js"

const router = express.Router()

// Get all available achievements
router.get("/", async (req, res) => {
  try {
    const achievements = await query("SELECT * FROM achievements ORDER BY points_value DESC")

    res.json({ achievements })
  } catch (error) {
    console.error("[v0] Error fetching achievements:", error)
    res.status(500).json({ error: "Failed to fetch achievements" })
  }
})

// Get user achievements for a session
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params

    const userAchievements = await query(
      `SELECT ua.*, a.achievement_name, a.achievement_description, a.badge_icon, a.points_value 
       FROM user_achievements ua 
       JOIN achievements a ON ua.achievement_id = a.achievement_id 
       WHERE ua.session_id = ? 
       ORDER BY ua.unlocked_at DESC`,
      [sessionId],
    )

    res.json({ achievements: userAchievements })
  } catch (error) {
    console.error("[v0] Error fetching user achievements:", error)
    res.status(500).json({ error: "Failed to fetch user achievements" })
  }
})

// Unlock achievement for user
router.post("/unlock", async (req, res) => {
  try {
    const { session_id, achievement_id } = req.body

    if (!session_id || !achievement_id) {
      return res.status(400).json({ error: "Session ID and Achievement ID are required" })
    }

    // Check if already unlocked
    const existing = await query("SELECT * FROM user_achievements WHERE session_id = ? AND achievement_id = ?", [
      session_id,
      achievement_id,
    ])

    if (existing.length > 0) {
      return res.status(409).json({ error: "Achievement already unlocked" })
    }

    // Unlock achievement
    await query("INSERT INTO user_achievements (session_id, achievement_id) VALUES (?, ?)", [
      session_id,
      achievement_id,
    ])

    const achievement = await query("SELECT * FROM achievements WHERE achievement_id = ?", [achievement_id])

    res.status(201).json({
      message: "Achievement unlocked",
      achievement: achievement[0],
    })
  } catch (error) {
    console.error("[v0] Error unlocking achievement:", error)
    res.status(500).json({ error: "Failed to unlock achievement" })
  }
})

export default router
