"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { Trophy, Award } from "lucide-react"
import { useGame } from "@/lib/game-context"
import { completeSession, getSession, getUserRank } from "@/lib/api"
import { calculateOverallScore, getRankFromScore } from "@/lib/scoring"
import { CertificateGenerator } from "@/components/certificate-generator"
import { ShareScore } from "@/components/share-score"

export default function CompletePage() {
  const router = useRouter()
  const { gameState, resetGame } = useGame()
  const [sessionData, setSessionData] = useState<any>(null)
  const [rankData, setRankData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    completeGame()
  }, [])

  const completeGame = async () => {
    if (!gameState.sessionId) {
      router.push("/character-creation")
      return
    }

    try {
      // Calculate final scores
      const overallScore = calculateOverallScore(
        gameState.passwordScore,
        gameState.phishingScore,
        gameState.linkSafetyScore,
        gameState.networkScore,
      )

      const rank = getRankFromScore(overallScore)

      // Complete session
      await completeSession(gameState.sessionId)

      // Get final session data
      const data = await getSession(gameState.sessionId)
      setSessionData(data.session)

      // Get rank
      const rankInfo = await getUserRank(gameState.sessionId)
      setRankData(rankInfo)
    } catch (error) {
      console.error("Failed to complete game:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center">
        <div className="text-primary text-xl">FINALIZING RESULTS...</div>
      </div>
    )
  }

  const overallScore = sessionData?.overall_score || 0
  const rank = sessionData?.rank_achieved || "Digital Novice"
  const achievementsCount = gameState.achievements.length

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader title="QUEST COMPLETE!" subtitle="Congratulations on completing your journey" />

        {/* Completion Banner */}
        <div className="terminal-border bg-card p-12 rounded-lg text-center mb-8">
          <div className="mb-6 flex justify-center">
            <div className="terminal-border rounded-full p-8 bg-primary/20 pulse-glow">
              <Trophy className="h-24 w-24 text-primary" />
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4 terminal-glow">MISSION ACCOMPLISHED!</h2>
          <p className="text-xl text-muted-foreground mb-8">
            You've successfully completed all cybersecurity challenges
          </p>

          {/* Final Score */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="terminal-border bg-background p-6 rounded-lg">
              <div className="text-5xl font-bold text-primary mb-2">{overallScore}</div>
              <div className="text-sm text-muted-foreground">FINAL SCORE</div>
            </div>

            <div className="terminal-border bg-background p-6 rounded-lg">
              <div className="text-2xl font-bold text-secondary mb-2">{rank}</div>
              <div className="text-sm text-muted-foreground">RANK ACHIEVED</div>
            </div>

            {/* Achievements Count */}
            <div className="terminal-border bg-background p-6 rounded-lg">
              <div className="text-5xl font-bold text-accent mb-2">{achievementsCount}</div>
              <div className="text-sm text-muted-foreground">BADGES EARNED</div>
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="terminal-border bg-card p-6 rounded-lg mb-8">
          <h3 className="text-2xl font-bold mb-6">PERFORMANCE BREAKDOWN</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Password Security</span>
              <span className="text-2xl font-bold text-primary">{gameState.passwordScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Phishing Detection</span>
              <span className="text-2xl font-bold text-secondary">{gameState.phishingScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Link Safety</span>
              <span className="text-2xl font-bold text-accent">{gameState.linkSafetyScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Network Security</span>
              <span className="text-2xl font-bold text-warning">{gameState.networkScore}%</span>
            </div>
          </div>
        </div>

        {/* Global Ranking */}
        {rankData && (
          <div className="terminal-border bg-card p-6 rounded-lg mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              GLOBAL RANKING
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">#{rankData.rank.global_rank}</div>
                <div className="text-sm text-muted-foreground">Your Global Rank</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">Top {rankData.percentile}%</div>
                <div className="text-sm text-muted-foreground">Percentile</div>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Generator and Share Component */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CertificateGenerator
            username={gameState.username}
            score={overallScore}
            rank={rankData?.rank.global_rank || 0}
            completionDate={sessionData?.completed_at || new Date().toISOString()}
            achievements={achievementsCount}
          />

          <div className="space-y-4">
            <div className="terminal-border bg-card p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Share Your Achievement</h3>
              <p className="text-muted-foreground mb-6">
                Let others know about your cybersecurity skills and challenge them to beat your score!
              </p>
              <ShareScore username={gameState.username} score={overallScore} rank={rankData?.rank.global_rank || 0} />
            </div>

            <Button
              size="lg"
              onClick={() => router.push("/leaderboard")}
              className="w-full terminal-border bg-accent hover:bg-accent/90"
            >
              <Trophy className="mr-2 h-5 w-5" />
              VIEW LEADERBOARD
            </Button>

            <Button
              size="lg"
              onClick={() => router.push("/game/achievements")}
              className="w-full terminal-border bg-secondary hover:bg-secondary/90"
            >
              <Award className="mr-2 h-5 w-5" />
              VIEW ALL BADGES
            </Button>
          </div>
        </div>

        {/* Play Again */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              resetGame()
              router.push("/")
            }}
            className="terminal-border bg-transparent"
          >
            PLAY AGAIN
          </Button>
        </div>
      </div>
    </div>
  )
}
