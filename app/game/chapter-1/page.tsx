"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TerminalHeader } from "@/components/terminal-header"
import { Eye, EyeOff } from "lucide-react"
import { useGame } from "@/lib/game-context"
import { calculatePasswordStrength, checkAchievementUnlock } from "@/lib/scoring"
import { updateChapterProgress, updateSessionScores, recordDecision, unlockAchievement } from "@/lib/api"

export default function Chapter1Page() {
  const router = useRouter()
  const { gameState, updateGameState } = useGame()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [securityQuestion, setSecurityQuestion] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!email || !password || !confirmPassword) {
      alert("Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    // Calculate score
    const strength = calculatePasswordStrength(password)
    const score = strength.score

    // Record decision
    if (gameState.sessionId) {
      await recordDecision({
        session_id: gameState.sessionId,
        chapter_id: 1,
        decision_type: "password_creation",
        decision_value: JSON.stringify({ length: password.length, score }),
        is_correct: score >= 70,
        points_earned: score,
        feedback_shown: strength.feedback.join(", "),
      })

      // Update scores
      await updateSessionScores(gameState.sessionId, {
        password_score: score,
      })

      // Check for achievement
      const achievement = checkAchievementUnlock("password_pro", { length: password.length, score })
      if (achievement.unlocked) {
        await unlockAchievement(gameState.sessionId, achievement.achievementId)
      }

      // Update chapter progress
      await updateChapterProgress(gameState.sessionId, 1, {
        status: "completed",
        score,
      })

      updateGameState({ passwordScore: score })
    }

    router.push(`/game/chapter-1/results?score=${score}`)
  }

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-2xl mx-auto">
        <TerminalHeader title="CHAPTER 1: CAMPUS SIGN-UP" subtitle="Create a secure account" progress={25} />

        <div className="terminal-border bg-card p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-primary">CAMPUS CONNECT SIGN-UP</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="terminal-border bg-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="terminal-border bg-input pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="terminal-border bg-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityQuestion">Security Question (Optional)</Label>
              <select
                id="securityQuestion"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="w-full terminal-border bg-input text-foreground p-2 rounded-md"
              >
                <option value="">Select a question...</option>
                <option value="pet">What was your first pet's name?</option>
                <option value="city">What city were you born in?</option>
                <option value="school">What was your elementary school?</option>
              </select>
            </div>

            {securityQuestion && (
              <div className="space-y-2">
                <Label htmlFor="securityAnswer">Your Answer</Label>
                <Input
                  id="securityAnswer"
                  type="text"
                  placeholder="Enter your answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="terminal-border bg-input"
                />
              </div>
            )}

            <Button type="submit" size="lg" className="w-full terminal-border bg-primary hover:bg-primary/90">
              CREATE ACCOUNT
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
