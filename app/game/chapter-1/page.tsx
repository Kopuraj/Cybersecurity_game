"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TerminalHeader } from "@/components/terminal-header"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useGame } from "@/lib/game-context"
import { analyzePasswordSecurity, checkAchievementUnlock } from "@/lib/scoring"
import { updateChapterProgress, updateSessionScores, recordDecision, unlockAchievement } from "@/lib/api"

export default function Chapter1Page() {
  const router = useRouter()
  const { gameState, updateGameState } = useGame()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword || !accountType) {
      alert("Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    const analysis = analyzePasswordSecurity(password, accountType)
    const score = analysis.score

    // Record decision
    if (gameState.sessionId) {
      await recordDecision({
        session_id: gameState.sessionId,
        chapter_id: 1,
        decision_type: "password_creation",
        decision_value: JSON.stringify({
          length: password.length,
          score,
          crackTime: analysis.crackTime,
          accountType,
        }),
        is_correct: score >= 70,
        points_earned: score,
        feedback_shown: analysis.weaknessType,
      })

      await updateSessionScores(gameState.sessionId, {
        password_score: score,
      })

      const achievement = checkAchievementUnlock("password_pro", { length: password.length, score })
      if (achievement.unlocked) {
        await unlockAchievement(gameState.sessionId, achievement.achievementId)
      }

      await updateChapterProgress(gameState.sessionId, 1, {
        status: "completed",
        score,
      })

      updateGameState({ passwordScore: score })
    }

    router.push(
      `/game/chapter-1/results?score=${score}&crackTime=${encodeURIComponent(analysis.crackTime)}&accountType=${accountType}`,
    )
  }

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-2xl mx-auto">
        <TerminalHeader
          title="CHAPTER 1: SECURE ACCOUNT CREATION"
          subtitle="Create a password for your account"
          progress={25}
        />

        <div className="terminal-border bg-card p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-primary">CREATE YOUR ACCOUNT</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type</Label>
              <select
                id="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full terminal-border bg-input text-foreground p-2 rounded-md"
                required
              >
                <option value="">Select account type...</option>
                <option value="social">Social Media Account</option>
                <option value="banking">Banking Account</option>
                <option value="email">Email Account</option>
                <option value="work">Work Account</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
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
                  placeholder="Create a password"
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

            <Button
              type="submit"
              size="lg"
              className="w-full terminal-border bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  SUBMITTING...
                </>
              ) : (
                "CREATE ACCOUNT"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
