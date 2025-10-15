"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { MessageCircle, Link2 } from "lucide-react"
import { useGame } from "@/lib/game-context"
import { updateChapterProgress, updateSessionScores, recordDecision, unlockAchievement } from "@/lib/api"
import { checkAchievementUnlock } from "@/lib/scoring"

const SUSPICIOUS_LINKS = [
  {
    id: 1,
    message: "Hey! Check out this amazing deal I found: http://amaz0n-deals.com/free-iphone",
    sender: "Unknown Contact",
    isSafe: false,
    analysis: {
      url: "http://amaz0n-deals.com/free-iphone",
      redFlags: ["Misspelled domain (amaz0n instead of amazon)", "Too good to be true offer", "HTTP instead of HTTPS"],
      verdict: "MALICIOUS - Likely phishing site",
    },
  },
  {
    id: 2,
    message: "Your package delivery failed. Track it here: https://fedex-tracking-update.net/track?id=12345",
    sender: "Delivery Service",
    isSafe: false,
    analysis: {
      url: "https://fedex-tracking-update.net/track?id=12345",
      redFlags: [
        "Suspicious domain (not official fedex.com)",
        "Unexpected delivery notification",
        "Requests tracking without context",
      ],
      verdict: "SUSPICIOUS - Fake delivery scam",
    },
  },
  {
    id: 3,
    message: "Here's the class notes from today: https://drive.google.com/file/d/abc123/view",
    sender: "Classmate",
    isSafe: true,
    analysis: {
      url: "https://drive.google.com/file/d/abc123/view",
      redFlags: [],
      verdict: "SAFE - Official Google Drive link",
    },
  },
]

export default function Chapter3Page() {
  const router = useRouter()
  const { gameState } = useGame()

  const [currentLinkIndex, setCurrentLinkIndex] = useState(0)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [decisions, setDecisions] = useState<Array<{ linkId: number; action: string; correct: boolean }>>([])

  const currentLink = SUSPICIOUS_LINKS[currentLinkIndex]

  const handleAction = async (action: string) => {
    setSelectedAction(action)

    const isSafeLink = currentLink.isSafe
    let isCorrect = false

    switch (action) {
      case "ignore":
        isCorrect = !isSafeLink
        break
      case "click":
        isCorrect = isSafeLink
        break
      case "verify":
      case "scan":
        isCorrect = true
        break
    }

    const newDecisions = [...decisions, { linkId: currentLink.id, action, correct: isCorrect }]
    setDecisions(newDecisions)

    // Record decision
    if (gameState.sessionId) {
      await recordDecision({
        session_id: gameState.sessionId,
        chapter_id: 3,
        decision_type: "link_analysis",
        decision_value: JSON.stringify({ linkId: currentLink.id, action }),
        is_correct: isCorrect,
        points_earned: isCorrect ? 20 : 0,
        feedback_shown: "",
      })
    }

    // If last link, go to results
    if (currentLinkIndex === SUSPICIOUS_LINKS.length - 1) {
      const correctCount = newDecisions.filter((d) => d.correct).length
      const score = Math.round((correctCount / SUSPICIOUS_LINKS.length) * 100)

      if (gameState.sessionId) {
        await updateSessionScores(gameState.sessionId, {
          link_safety_score: score,
        })

        const achievement = checkAchievementUnlock("link_guardian", { safeActions: correctCount })
        if (achievement.unlocked) {
          await unlockAchievement(gameState.sessionId, achievement.achievementId)
        }

        await updateChapterProgress(gameState.sessionId, 3, {
          status: "completed",
          score,
        })
      }

      router.push(`/game/chapter-3/results?score=${score}&correct=${correctCount}&total=${SUSPICIOUS_LINKS.length}`)
    } else {
      // Next link
      setTimeout(() => {
        setCurrentLinkIndex(currentLinkIndex + 1)
        setSelectedAction(null)
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader title="CHAPTER 3: LINK LABYRINTH" subtitle="Analyze suspicious links" progress={75} />

        <div className="terminal-border bg-card p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="h-6 w-6 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Message from:</div>
              <div className="font-bold">{currentLink.sender}</div>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              Link {currentLinkIndex + 1} of {SUSPICIOUS_LINKS.length}
            </div>
          </div>

          <div className="terminal-border bg-background p-6 rounded-lg mb-6">
            <p className="text-foreground mb-4">{currentLink.message}</p>

            <div className="terminal-border bg-card p-4 rounded flex items-center gap-3">
              <Link2 className="h-5 w-5 text-warning flex-shrink-0" />
              <code className="text-sm text-primary break-all">{currentLink.analysis.url}</code>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleAction("ignore")}
                variant="outline"
                className="terminal-border"
                disabled={selectedAction !== null}
              >
                IGNORE LINK
              </Button>
              <Button
                onClick={() => handleAction("click")}
                variant="outline"
                className="terminal-border border-warning text-warning hover:bg-warning/10"
                disabled={selectedAction !== null}
              >
                CLICK LINK
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleAction("verify")}
                className="terminal-border bg-primary hover:bg-primary/90"
                disabled={selectedAction !== null}
              >
                VERIFY SENDER
              </Button>
              <Button
                onClick={() => handleAction("scan")}
                className="terminal-border bg-secondary hover:bg-secondary/90"
                disabled={selectedAction !== null}
              >
                SCAN WITH TOOL
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
