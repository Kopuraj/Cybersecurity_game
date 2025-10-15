"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { Trophy, Medal, Award, Crown, ArrowLeft } from "lucide-react"
import { getTopLeaderboard, getDailyLeaderboard } from "@/lib/api"

interface LeaderboardEntry {
  leaderboard_id: number
  username: string
  overall_score: number
  rank_achieved: string
  completed_at: string
  global_rank?: number
  daily_rank?: number
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [view, setView] = useState<"global" | "daily">("global")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [view])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      if (view === "global") {
        const data = await getTopLeaderboard(10)
        setLeaderboard(data.leaderboard)
      } else {
        const data = await getDailyLeaderboard()
        setLeaderboard(data.leaderboard)
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-warning" />
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />
      case 3:
        return <Award className="h-6 w-6 text-destructive" />
      default:
        return <Trophy className="h-6 w-6 text-primary" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-warning"
      case 2:
        return "text-muted-foreground"
      case 3:
        return "text-destructive"
      default:
        return "text-primary"
    }
  }

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader title="GLOBAL LEADERBOARD" subtitle="Top cybersecurity champions" />

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setView("global")}
            className={`terminal-border ${
              view === "global" ? "bg-primary hover:bg-primary/90" : "bg-transparent border-primary text-primary"
            }`}
          >
            GLOBAL RANKINGS
          </Button>
          <Button
            onClick={() => setView("daily")}
            className={`terminal-border ${
              view === "daily" ? "bg-secondary hover:bg-secondary/90" : "bg-transparent border-secondary text-secondary"
            }`}
          >
            DAILY RANKINGS
          </Button>
        </div>

        {/* Leaderboard */}
        <div className="terminal-border bg-card p-6 rounded-lg">
          {loading ? (
            <div className="text-center py-12 text-primary">LOADING RANKINGS...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No rankings available yet. Be the first to complete the quest!
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => {
                const rank = view === "global" ? entry.global_rank || index + 1 : entry.daily_rank || index + 1

                return (
                  <div
                    key={entry.leaderboard_id}
                    className={`terminal-border p-4 rounded-lg transition-all ${
                      rank <= 3 ? "bg-primary/10 pulse-glow" : "bg-background"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-16">
                        <div className="text-center">
                          {getRankIcon(rank)}
                          <div className={`text-2xl font-bold ${getRankColor(rank)} mt-1`}>#{rank}</div>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="text-lg font-bold">{entry.username}</div>
                        <div className="text-sm text-muted-foreground">{entry.rank_achieved}</div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">{entry.overall_score}</div>
                        <div className="text-xs text-muted-foreground">POINTS</div>
                      </div>

                      {/* Date */}
                      <div className="text-right text-xs text-muted-foreground w-24">
                        {new Date(entry.completed_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && leaderboard.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="terminal-border bg-card p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-warning">{leaderboard[0]?.overall_score || 0}</div>
              <div className="text-xs text-muted-foreground">TOP SCORE</div>
            </div>
            <div className="terminal-border bg-card p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(leaderboard.reduce((sum, e) => sum + e.overall_score, 0) / leaderboard.length)}
              </div>
              <div className="text-xs text-muted-foreground">AVERAGE</div>
            </div>
            <div className="terminal-border bg-card p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-accent">{leaderboard.length}</div>
              <div className="text-xs text-muted-foreground">PLAYERS</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button variant="outline" className="terminal-border bg-transparent" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            BACK TO HOME
          </Button>
          <Button
            className="terminal-border bg-primary hover:bg-primary/90"
            onClick={() => router.push("/character-creation")}
          >
            START YOUR QUEST
          </Button>
        </div>
      </div>
    </div>
  )
}
