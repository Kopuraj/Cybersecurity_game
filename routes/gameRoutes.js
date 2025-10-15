import express from "express"
import { query } from "../config/database.js"

const router = express.Router()

// Start new game session
router.post("/session/start", async (req, res) => {
  try {
    const { user_id } = req.body

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" })
    }

    // Create new game session
    const result = await query("INSERT INTO game_sessions (user_id) VALUES (?)", [user_id])

    const sessionId = result.insertId

    // Initialize chapter progress (all locked except chapter 0 and 1)
    const chapters = await query("SELECT chapter_id, chapter_number FROM chapters")

    for (const chapter of chapters) {
      const status = chapter.chapter_number <= 1 ? "in_progress" : "locked"
      await query("INSERT INTO user_progress (session_id, chapter_id, status) VALUES (?, ?, ?)", [
        sessionId,
        chapter.chapter_id,
        status,
      ])
    }

    res.status(201).json({
      message: "Game session started",
      session_id: sessionId,
    })
  } catch (error) {
    console.error("[v0] Error starting game session:", error)
    res.status(500).json({ error: "Failed to start game session" })
  }
})

// Get session progress
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params

    const session = await query(
      `SELECT gs.*, u.username, u.avatar_id 
       FROM game_sessions gs 
       JOIN users u ON gs.user_id = u.user_id 
       WHERE gs.session_id = ?`,
      [sessionId],
    )

    if (session.length === 0) {
      return res.status(404).json({ error: "Session not found" })
    }

    const progress = await query(
      `SELECT up.*, c.chapter_name, c.chapter_number, c.chapter_description 
       FROM user_progress up 
       JOIN chapters c ON up.chapter_id = c.chapter_id 
       WHERE up.session_id = ? 
       ORDER BY c.chapter_number`,
      [sessionId],
    )

    res.json({
      session: session[0],
      progress: progress,
    })
  } catch (error) {
    console.error("[v0] Error fetching session:", error)
    res.status(500).json({ error: "Failed to fetch session" })
  }
})

// Update chapter progress
router.put("/progress/:sessionId/:chapterId", async (req, res) => {
  try {
    const { sessionId, chapterId } = req.params
    const { status, score } = req.body

    const updates = []
    const values = []

    if (status) {
      updates.push("status = ?")
      values.push(status)

      if (status === "in_progress" && !updates.includes("started_at")) {
        updates.push("started_at = NOW()")
      }
      if (status === "completed") {
        updates.push("completed_at = NOW()")
      }
    }

    if (score !== undefined) {
      updates.push("score = ?")
      values.push(score)
    }

    updates.push("attempts = attempts + 1")
    values.push(sessionId, chapterId)

    await query(`UPDATE user_progress SET ${updates.join(", ")} WHERE session_id = ? AND chapter_id = ?`, values)

    // If chapter completed, unlock next chapter
    if (status === "completed") {
      const nextChapter = await query(
        `SELECT c.chapter_id FROM chapters c 
         WHERE c.chapter_number = (
           SELECT chapter_number + 1 FROM chapters WHERE chapter_id = ?
         )`,
        [chapterId],
      )

      if (nextChapter.length > 0) {
        await query("UPDATE user_progress SET status = ? WHERE session_id = ? AND chapter_id = ?", [
          "in_progress",
          sessionId,
          nextChapter[0].chapter_id,
        ])
      }
    }

    res.json({ message: "Progress updated successfully" })
  } catch (error) {
    console.error("[v0] Error updating progress:", error)
    res.status(500).json({ error: "Failed to update progress" })
  }
})

// Record player decision
router.post("/decision", async (req, res) => {
  try {
    const { session_id, chapter_id, decision_type, decision_value, is_correct, points_earned, feedback_shown } =
      req.body

    await query(
      `INSERT INTO decisions (session_id, chapter_id, decision_type, decision_value, is_correct, points_earned, feedback_shown) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [session_id, chapter_id, decision_type, decision_value, is_correct, points_earned, feedback_shown],
    )

    res.status(201).json({ message: "Decision recorded" })
  } catch (error) {
    console.error("[v0] Error recording decision:", error)
    res.status(500).json({ error: "Failed to record decision" })
  }
})

// Update session scores
router.put("/session/:sessionId/scores", async (req, res) => {
  try {
    const { sessionId } = req.params
    const { overall_score, password_score, phishing_score, link_safety_score, network_score, rank_achieved } = req.body

    const updates = []
    const values = []

    if (overall_score !== undefined) {
      updates.push("overall_score = ?")
      values.push(overall_score)
    }
    if (password_score !== undefined) {
      updates.push("password_score = ?")
      values.push(password_score)
    }
    if (phishing_score !== undefined) {
      updates.push("phishing_score = ?")
      values.push(phishing_score)
    }
    if (link_safety_score !== undefined) {
      updates.push("link_safety_score = ?")
      values.push(link_safety_score)
    }
    if (network_score !== undefined) {
      updates.push("network_score = ?")
      values.push(network_score)
    }
    if (rank_achieved) {
      updates.push("rank_achieved = ?")
      values.push(rank_achieved)
    }

    values.push(sessionId)

    await query(`UPDATE game_sessions SET ${updates.join(", ")} WHERE session_id = ?`, values)

    res.json({ message: "Scores updated successfully" })
  } catch (error) {
    console.error("[v0] Error updating scores:", error)
    res.status(500).json({ error: "Failed to update scores" })
  }
})

// Complete game session
router.put("/session/:sessionId/complete", async (req, res) => {
  try {
    const { sessionId } = req.params

    await query("UPDATE game_sessions SET is_completed = TRUE, completed_at = NOW() WHERE session_id = ?", [sessionId])

    // Add to leaderboard
    const session = await query(
      `SELECT gs.session_id, gs.user_id, u.username, gs.overall_score, gs.rank_achieved 
       FROM game_sessions gs 
       JOIN users u ON gs.user_id = u.user_id 
       WHERE gs.session_id = ?`,
      [sessionId],
    )

    if (session.length > 0) {
      const { session_id, user_id, username, overall_score, rank_achieved } = session[0]

      await query(
        "INSERT INTO leaderboard (session_id, user_id, username, overall_score, rank_achieved) VALUES (?, ?, ?, ?, ?)",
        [session_id, user_id, username, overall_score, rank_achieved],
      )
    }

    res.json({ message: "Game session completed" })
  } catch (error) {
    console.error("[v0] Error completing session:", error)
    res.status(500).json({ error: "Failed to complete session" })
  }
})

export default router
