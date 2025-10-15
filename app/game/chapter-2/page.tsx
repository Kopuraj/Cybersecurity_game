"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { Mail, AlertTriangle } from "lucide-react"
import { useGame } from "@/lib/game-context"
import { updateChapterProgress, updateSessionScores, recordDecision, unlockAchievement } from "@/lib/api"
import { checkAchievementUnlock } from "@/lib/scoring"

const PHISHING_EMAIL = {
  from: "IT Support <support@campus.net-alerts.com>",
  subject: "URGENT: Verify Your Account Immediately - Security Breach Detected",
  body: `Dear Student,

We have detected suspicious activity on your Campus Connect account. Your account will be SUSPENDED within 24 hours unless you verify your identity immediately.

CLICK HERE TO RESOLVE ISSUE: https://verify-campus.net-alerts.com/login

Failure to verify will result in permanent account closure and loss of all data.

This is an automated security alert. Do not reply to this email.

Best regards,
IT Security Team
Campus Connect`,
  isPhishing: true,
  redFlags: [
    "Suspicious sender address (campus.net-alerts.com instead of official domain)",
    "Urgent/threatening language creating panic",
    "Suspicious link with misspelled domain",
    "Requests immediate action without proper verification",
    "Generic greeting instead of personalized",
  ],
}

export default function Chapter2Page() {
  const router = useRouter()
  const { gameState } = useGame()

  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const handleAction = async (action: string) => {
    setSelectedAction(action)

    let isCorrect = false
    let points = 0

    switch (action) {
      case "mark_phishing":
        isCorrect = true
        points = 25
        break
      case "click_link":
        isCorrect = false
        points = 0
        break
      case "forward":
        isCorrect = true
        points = 15
        break
      case "reply":
        isCorrect = false
        points = 0
        break
    }

    // Record decision
    if (gameState.sessionId) {
      await recordDecision({
        session_id: gameState.sessionId,
        chapter_id: 2,
        decision_type: "phishing_detection",
        decision_value: action,
        is_correct: isCorrect,
        points_earned: points,
        feedback_shown: "",
      })

      const score = points * 4

      await updateSessionScores(gameState.sessionId, {
        phishing_score: score,
      })

      const achievement = checkAchievementUnlock("phish_fighter", { correctCount: isCorrect ? 1 : 0 })
      if (achievement.unlocked) {
        await unlockAchievement(gameState.sessionId, achievement.achievementId)
      }

      await updateChapterProgress(gameState.sessionId, 2, {
        status: "completed",
        score,
      })
    }

    router.push(`/game/chapter-2/results?action=${action}&correct=${isCorrect}&points=${points}`)
  }

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader title="CHAPTER 2: PHISHING EXPEDITION" subtitle="Identify suspicious emails" progress={50} />

        <div className="terminal-border bg-card p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
            <Mail className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">From:</div>
              <div className="font-mono text-sm">{PHISHING_EMAIL.from}</div>
            </div>
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>

          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-1">Subject:</div>
            <div className="text-lg font-bold text-destructive">{PHISHING_EMAIL.subject}</div>
          </div>

          <div className="terminal-border bg-background p-6 rounded-lg mb-6">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {PHISHING_EMAIL.body}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleAction("mark_phishing")}
              className="terminal-border bg-destructive hover:bg-destructive/90"
              disabled={selectedAction !== null}
            >
              MARK AS PHISHING
            </Button>
            <Button
              onClick={() => handleAction("click_link")}
              variant="outline"
              className="terminal-border"
              disabled={selectedAction !== null}
            >
              CLICK LINK
            </Button>
            <Button
              onClick={() => handleAction("forward")}
              variant="outline"
              className="terminal-border"
              disabled={selectedAction !== null}
            >
              FORWARD TO IT
            </Button>
            <Button
              onClick={() => handleAction("reply")}
              variant="outline"
              className="terminal-border"
              disabled={selectedAction !== null}
            >
              REPLY
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
