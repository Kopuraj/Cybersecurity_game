"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { Lock, Fish, Link2, Wifi, CheckCircle, Circle, LockIcon, ArrowRight } from "lucide-react"
import { useGame } from "@/lib/game-context"
import { getSession } from "@/lib/api"

interface Chapter {
  id: number
  number: number
  name: string
  description: string
  status: "completed" | "in_progress" | "locked"
  icon: any
  color: string
  route: string
}

export default function JourneyPage() {
  const router = useRouter()
  const { gameState } = useGame()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    if (!gameState.sessionId) {
      router.push("/character-creation")
      return
    }

    try {
      const data = await getSession(gameState.sessionId)

      const chapterData: Chapter[] = [
        {
          id: 1,
          number: 1,
          name: "Campus Sign-Up",
          description: "Create a secure account with strong password practices",
          status: "in_progress",
          icon: Lock,
          color: "text-primary",
          route: "/game/chapter-1",
        },
        {
          id: 2,
          number: 2,
          name: "Phishing Expedition",
          description: "Identify and avoid phishing attempts in your inbox",
          status: "locked",
          icon: Fish,
          color: "text-secondary",
          route: "/game/chapter-2",
        },
        {
          id: 3,
          number: 3,
          name: "Link Labyrinth",
          description: "Analyze suspicious links and protect yourself",
          status: "locked",
          icon: Link2,
          color: "text-accent",
          route: "/game/chapter-3",
        },
        {
          id: 4,
          number: 4,
          name: "Public WiFi Challenge",
          description: "Navigate public networks safely",
          status: "locked",
          icon: Wifi,
          color: "text-warning",
          route: "/game/chapter-4",
        },
      ]

      // Update status based on API data
      if (data.progress) {
        data.progress.forEach((prog: any) => {
          const chapter = chapterData.find((c) => c.id === prog.chapter_id)
          if (chapter && prog.chapter_number > 0) {
            chapter.status = prog.status
          }
        })
      }

      setChapters(chapterData)
    } catch (error) {
      console.error("Failed to load progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-success" />
      case "in_progress":
        return <Circle className="h-6 w-6 text-warning" />
      case "locked":
        return <LockIcon className="h-6 w-6 text-muted-foreground" />
      default:
        return <Circle className="h-6 w-6 text-muted-foreground" />
    }
  }

  const handleChapterClick = (chapter: Chapter) => {
    if (chapter.status !== "locked") {
      router.push(chapter.route)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center">
        <div className="text-primary text-xl">LOADING JOURNEY...</div>
      </div>
    )
  }

  const completedCount = chapters.filter((c) => c.status === "completed").length
  const progress = Math.round((completedCount / chapters.length) * 100)

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-6xl mx-auto">
        <TerminalHeader
          title="YOUR DIGITAL JOURNEY"
          subtitle={`${gameState.username}'s Progress`}
          progress={progress}
        />

        {/* Journey Map */}
        <div className="space-y-6">
          {chapters.map((chapter, index) => {
            const Icon = chapter.icon
            const isLocked = chapter.status === "locked"
            const isCompleted = chapter.status === "completed"
            const isInProgress = chapter.status === "in_progress"

            return (
              <div key={chapter.id}>
                <button
                  onClick={() => handleChapterClick(chapter)}
                  disabled={isLocked}
                  className={`w-full terminal-border bg-card p-6 rounded-lg transition-all ${
                    isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-muted cursor-pointer"
                  } ${isInProgress ? "pulse-glow" : ""}`}
                >
                  <div className="flex items-center gap-6">
                    {/* Chapter Icon */}
                    <div
                      className={`terminal-border rounded-full p-4 ${
                        isCompleted ? "bg-success/20" : isInProgress ? "bg-primary/20" : "bg-muted"
                      }`}
                    >
                      <Icon className={`h-12 w-12 ${isLocked ? "text-muted-foreground" : chapter.color}`} />
                    </div>

                    {/* Chapter Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">
                          C{chapter.number}: {chapter.name}
                        </h3>
                        {getStatusIcon(chapter.status)}
                      </div>
                      <p className="text-muted-foreground">{chapter.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {isCompleted && <span className="text-xs text-success">✓ COMPLETED</span>}
                        {isInProgress && <span className="text-xs text-warning">● IN PROGRESS</span>}
                        {isLocked && <span className="text-xs text-muted-foreground">🔒 LOCKED</span>}
                      </div>
                    </div>

                    {/* Action Button */}
                    {!isLocked && (
                      <div>
                        <ArrowRight className="h-8 w-8 text-primary" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Connector Line */}
                {index < chapters.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className={`w-1 h-8 ${isCompleted ? "bg-success" : "bg-muted"}`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button
            variant="outline"
            className="terminal-border bg-transparent"
            onClick={() => router.push("/game/scorecard")}
          >
            VIEW SCORECARD
          </Button>
          <Button
            variant="outline"
            className="terminal-border bg-transparent"
            onClick={() => router.push("/game/achievements")}
          >
            VIEW ACHIEVEMENTS
          </Button>
        </div>
      </div>
    </div>
  )
}
