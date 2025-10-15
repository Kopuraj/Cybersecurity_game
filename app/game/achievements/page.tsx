"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { Lock, Fish, Link2, Wifi, Shield, Star, Trophy, Award, ArrowLeft } from "lucide-react"
import { useGame } from "@/lib/game-context"
import { getAllAchievements, getUserAchievements } from "@/lib/api"

interface Achievement {
  achievement_id: number
  achievement_name: string
  achievement_description: string
  badge_icon: string
  points_value: number
  unlocked?: boolean
  unlocked_at?: string
}

const BADGE_ICONS: Record<string, any> = {
  lock: Lock,
  fish: Fish,
  link: Link2,
  wifi: Wifi,
  shield: Shield,
  star: Star,
  trophy: Trophy,
}

export default function AchievementsPage() {
  const router = useRouter()
  const { gameState } = useGame()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    if (!gameState.sessionId) {
      router.push("/character-creation")
      return
    }

    try {
      // Get all available achievements
      const allAchievements = await getAllAchievements()

      // Get user's unlocked achievements
      const userAchievements = await getUserAchievements(gameState.sessionId)

      // Merge data
      const mergedAchievements = allAchievements.achievements.map((achievement: Achievement) => {
        const unlocked = userAchievements.achievements.find(
          (ua: any) => ua.achievement_id === achievement.achievement_id,
        )
        return {
          ...achievement,
          unlocked: !!unlocked,
          unlocked_at: unlocked?.unlocked_at,
        }
      })

      setAchievements(mergedAchievements)
    } catch (error) {
      console.error("Failed to load achievements:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center">
        <div className="text-primary text-xl">LOADING ACHIEVEMENTS...</div>
      </div>
    )
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalPoints = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points_value, 0)

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-6xl mx-auto">
        <TerminalHeader title="ACHIEVEMENT UNLOCKED!" subtitle="Your earned badges and accomplishments" />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="terminal-border bg-card p-6 rounded-lg text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-3" />
            <div className="text-4xl font-bold text-primary mb-2">{unlockedCount}</div>
            <div className="text-sm text-muted-foreground">Badges Unlocked</div>
          </div>

          <div className="terminal-border bg-card p-6 rounded-lg text-center">
            <Star className="h-12 w-12 text-warning mx-auto mb-3" />
            <div className="text-4xl font-bold text-warning mb-2">{totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>

          <div className="terminal-border bg-card p-6 rounded-lg text-center">
            <Award className="h-12 w-12 text-accent mx-auto mb-3" />
            <div className="text-4xl font-bold text-accent mb-2">
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Completion</div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const Icon = BADGE_ICONS[achievement.badge_icon] || Shield
            const isUnlocked = achievement.unlocked

            return (
              <div
                key={achievement.achievement_id}
                className={`terminal-border bg-card p-6 rounded-lg transition-all ${
                  isUnlocked ? "badge-unlock" : "opacity-50"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Badge Icon */}
                  <div
                    className={`terminal-border rounded-full p-6 mb-4 ${
                      isUnlocked ? "bg-primary/20 pulse-glow" : "bg-muted"
                    }`}
                  >
                    <Icon className={`h-12 w-12 ${isUnlocked ? "text-primary" : "text-muted-foreground"}`} />
                  </div>

                  {/* Badge Name */}
                  <h3 className="text-xl font-bold mb-2">{achievement.achievement_name}</h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4">{achievement.achievement_description}</p>

                  {/* Points */}
                  <div className="flex items-center gap-2 mb-3">
                    <Star className={`h-4 w-4 ${isUnlocked ? "text-warning" : "text-muted-foreground"}`} />
                    <span className={`font-bold ${isUnlocked ? "text-warning" : "text-muted-foreground"}`}>
                      {achievement.points_value} POINTS
                    </span>
                  </div>

                  {/* Status */}
                  {isUnlocked ? (
                    <div className="terminal-border bg-success/20 text-success px-4 py-2 rounded-full text-sm font-bold">
                      ✓ UNLOCKED
                    </div>
                  ) : (
                    <div className="terminal-border bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-bold">
                      🔒 LOCKED
                    </div>
                  )}

                  {/* Unlock Date */}
                  {isUnlocked && achievement.unlocked_at && (
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(achievement.unlocked_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
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
            onClick={() => router.push("/game/scorecard")}
          >
            VIEW SCORECARD
          </Button>
          <Button
            className="terminal-border bg-secondary hover:bg-secondary/90"
            onClick={() => router.push("/leaderboard")}
          >
            VIEW LEADERBOARD
          </Button>
        </div>
      </div>
    </div>
  )
}
