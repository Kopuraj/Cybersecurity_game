"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { Wifi, Lock, Shield } from "lucide-react"
import { useGame } from "@/lib/game-context"
import { updateChapterProgress, updateSessionScores, recordDecision, unlockAchievement } from "@/lib/api"
import { checkAchievementUnlock } from "@/lib/scoring"

const WIFI_NETWORKS = [
  {
    id: 1,
    name: "Free_Campus_Guest",
    signal: "Strong",
    security: "Open",
    isSafe: false,
    riskLevel: "high" as const,
    description: "Unencrypted public network - anyone can intercept your data",
  },
  {
    id: 2,
    name: "Student_Network_Secure",
    signal: "Strong",
    security: "WPA3",
    isSafe: true,
    riskLevel: "low" as const,
    description: "Official campus network with strong encryption",
  },
  {
    id: 3,
    name: "COFFEE_SHOP_FREE",
    signal: "Medium",
    security: "Open",
    isSafe: false,
    riskLevel: "high" as const,
    description: "Public hotspot without password protection",
  },
]

export default function Chapter4Page() {
  const router = useRouter()
  const { gameState } = useGame()

  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null)
  const [useVPN, setUseVPN] = useState(false)

  const handleConnect = async () => {
    if (selectedNetwork === null) {
      alert("Please select a network first")
      return
    }

    const network = WIFI_NETWORKS.find((n) => n.id === selectedNetwork)
    if (!network) return

    let isCorrect = false
    let points = 0

    if (network.isSafe && !useVPN) {
      isCorrect = true
      points = 20
    } else if (network.isSafe && useVPN) {
      isCorrect = true
      points = 25
    } else if (!network.isSafe && useVPN) {
      isCorrect = true
      points = 20
    } else {
      isCorrect = false
      points = 0
    }

    const score = isCorrect ? Math.min(100, points * 4) : 0

    if (gameState.sessionId) {
      await recordDecision({
        session_id: gameState.sessionId,
        chapter_id: 4,
        decision_type: "wifi_selection",
        decision_value: JSON.stringify({ networkId: network.id, useVPN }),
        is_correct: isCorrect,
        points_earned: points,
        feedback_shown: "",
      })

      await updateSessionScores(gameState.sessionId, {
        network_score: score,
      })

      const achievement = checkAchievementUnlock("wifi_warrior", { secureChoices: isCorrect })
      if (achievement.unlocked) {
        await unlockAchievement(gameState.sessionId, achievement.achievementId)
      }

      await updateChapterProgress(gameState.sessionId, 4, {
        status: "completed",
        score,
      })
    }

    router.push(
      `/game/chapter-4/results?network=${network.id}&vpn=${useVPN}&correct=${isCorrect}&points=${points}&score=${score}`,
    )
  }

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader
          title="CHAPTER 4: PUBLIC WIFI CHALLENGE"
          subtitle="Navigate public networks safely"
          progress={100}
        />

        <div className="terminal-border bg-card p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Wifi className="h-8 w-8 text-primary" />
            PUBLIC WIFI: STAY SECURE
          </h2>

          <p className="text-muted-foreground mb-6">
            You're at a coffee shop and need to check your email. Select a network and decide whether to use a VPN.
          </p>

          <div className="space-y-3 mb-6">
            <h3 className="font-bold text-sm text-muted-foreground mb-3">AVAILABLE NETWORKS:</h3>

            {WIFI_NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => setSelectedNetwork(network.id)}
                className={`w-full terminal-border p-4 rounded-lg transition-all text-left ${
                  selectedNetwork === network.id ? "bg-primary/20 border-primary" : "bg-background hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wifi className={`h-5 w-5 ${network.security === "Open" ? "text-destructive" : "text-success"}`} />
                    <span className="font-bold">{network.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{network.signal}</span>
                    {network.security === "Open" ? (
                      <span className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive">
                        {network.security}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded bg-success/20 text-success flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        {network.security}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="terminal-border bg-background p-4 rounded-lg mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useVPN}
                onChange={(e) => setUseVPN(e.target.checked)}
                className="w-5 h-5 rounded border-primary text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold">
                  <Shield className="h-5 w-5 text-primary" />
                  USE VPN
                </div>
                <p className="text-xs text-muted-foreground mt-1">Encrypt your connection for maximum security</p>
              </div>
            </label>
          </div>

          <Button
            size="lg"
            onClick={handleConnect}
            disabled={selectedNetwork === null}
            className="w-full terminal-border bg-primary hover:bg-primary/90"
          >
            CONNECT TO NETWORK
          </Button>
        </div>
      </div>
    </div>
  )
}
