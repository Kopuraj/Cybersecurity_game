import express from "express"
import { query } from "../config/database.js"

const router = express.Router()

// Create new user profile
router.post("/create", async (req, res) => {
  try {
    const { username, email, avatar_id } = req.body

    if (!username || username.length < 2 || username.length > 20) {
      return res.status(400).json({
        error: "Username must be between 2 and 20 characters",
      })
    }

    // Check if username already exists
    const existingUser = await query("SELECT user_id FROM users WHERE username = ?", [username])

    if (existingUser.length > 0) {
      return res.status(409).json({
        error: "Username already taken",
      })
    }

    // Create new user
    const result = await query("INSERT INTO users (username, email, avatar_id) VALUES (?, ?, ?)", [
      username,
      email || null,
      avatar_id || 1,
    ])

    const newUser = await query("SELECT user_id, username, avatar_id, created_at FROM users WHERE user_id = ?", [
      result.insertId,
    ])

    res.status(201).json({
      message: "User created successfully",
      user: newUser[0],
    })
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    res.status(500).json({ error: "Failed to create user" })
  }
})

// Get user profile
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const user = await query(
      "SELECT user_id, username, email, avatar_id, created_at, last_login FROM users WHERE user_id = ?",
      [userId],
    )

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user: user[0] })
  } catch (error) {
    console.error("[v0] Error fetching user:", error)
    res.status(500).json({ error: "Failed to fetch user" })
  }
})

// Update user profile
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const { username, email, avatar_id } = req.body

    const updates = []
    const values = []

    if (username) {
      updates.push("username = ?")
      values.push(username)
    }
    if (email !== undefined) {
      updates.push("email = ?")
      values.push(email)
    }
    if (avatar_id) {
      updates.push("avatar_id = ?")
      values.push(avatar_id)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" })
    }

    values.push(userId)

    await query(`UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`, values)

    const updatedUser = await query("SELECT user_id, username, email, avatar_id FROM users WHERE user_id = ?", [userId])

    res.json({
      message: "User updated successfully",
      user: updatedUser[0],
    })
  } catch (error) {
    console.error("[v0] Error updating user:", error)
    res.status(500).json({ error: "Failed to update user" })
  }
})

export default router
