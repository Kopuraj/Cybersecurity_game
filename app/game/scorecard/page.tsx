"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { Lock, Fish, Link2, Wifi, Trophy, ArrowLeft } from "lucide-react"
import { useGame } from "@/lib/game-context"
import { getSession } from "@/lib/api"

export default function ScorecardPage() {
  const router = useRouter()
  const { gameState } = useGame()
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScorecard()
  }, [])

  const loadScorecard = async () => {
    if (!gameState.sessionId) {
      router.push("/character-creation")
      return
    }

    try {
      const data = await getSession(gameState.sessionId)
      setSessionData(data.session)
    } catch (error) {
      console.error("Failed to load scorecard:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center">
        <div className="text-primary text-xl">LOADING SCORECARD...</div>
      </div>
    )
  }

  const overallScore = sessionData?.overall_score || 0
  const passwordScore = sessionData?.password_score || 0
  const phishingScore = sessionData?.phishing_score || 0
  const linkScore = sessionData?.link_safety_score || 0
  const networkScore = sessionData?.network_score || 0

  const getRank = (score: number) => {
    if (score >= 95) return { name: "EXPERT", color: "text-success" }
    if (score >= 85) return { name: "ADVANCED", color: "text-primary" }
    if (score >= 70) return { name: "INTERMEDIATE", color: "text-warning" }
    if (score >= 50) return { name: "NOVICE", color: "text-secondary" }
    return { name: "BEGINNER", color: "text-muted-foreground" }
  }

  const overallRank = getRank(overallScore)

  const categories = [
    { name: "Password Security", score: passwordScore, icon: Lock, color: "text-primary" },
    { name: "Phishing Awareness", score: phishingScore, icon: Fish, color: "text-secondary" },
    { name: "Link Safety", score: linkScore, icon: Link2, color: "text-accent" },
    { name: "Network Security", score: networkScore, icon: Wifi, color: "text-warning" },
  ]

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader title="SECURITY SCORECARD" subtitle="Your cybersecurity performance" />

        {/* Overall Score */}
        <div className="terminal-border bg-card p-8 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">OVERALL PROTECTION LEVEL</h2>
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-bold ${overallRank.color}`}>{overallRank.name}</div>
                <div className="h-12 w-1 bg-border" />
                <div className="text-5xl font-bold text-primary">{overallScore}</div>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="relative h-32 w-32">
              <svg className="transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(overallScore / 100) * 251} 251`}
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="h-12 w-12 text-primary" />
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-1000"
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>

        {/* Category Scores */}
        <div className="space-y-4">
          {categories.map((category) => {
            const Icon = category.icon
            const rank = getRank(category.score)

            return (
              <div key={category.name} className="terminal-border bg-card p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-3">
                  <Icon className={`h-8 w-8 ${category.color}`} />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{category.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{category.score}%</div>
                    <div className={`text-sm ${rank.color}`}>{rank.name}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      category.score >= 85
                        ? "bg-success"
                        : category.score >= 70
                          ? "bg-primary"
                          : category.score >= 50
                            ? "bg-warning"
                            : "bg-destructive"
                    }`}
                    style={{ width: `${category.score}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button
            variant="outline"
            className="terminal-border bg-transparent"
            onClick={() => router.push("/game/journey")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            BACK TO JOURNEY
          </Button>
          <Button
            className="terminal-border bg-primary hover:bg-primary/90"
            onClick={() => router.push("/game/achievements")}
          >
            VIEW BADGES
          </Button>
        </div>
      </div>
    </div>
  )
}
