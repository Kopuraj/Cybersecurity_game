"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, Plus, RotateCcw, ArrowLeft } from "lucide-react"

export default function UserSelectionPage() {
  const router = useRouter()
  const [hasExistingGame, setHasExistingGame] = useState(false)
  const [existingUsername, setExistingUsername] = useState("")

  useEffect(() => {
    // Check if there's an existing game session in localStorage
    const savedUser = localStorage.getItem("cybersafe_user")
    const savedSession = localStorage.getItem("cybersafe_session")

    if (savedUser && savedSession) {
      const user = JSON.parse(savedUser)
      setExistingUsername(user.username)
      setHasExistingGame(true)
    }
  }, [])

  const handleNewGame = () => {
    // Clear localStorage to start fresh
    localStorage.removeItem("cybersafe_user")
    localStorage.removeItem("cybersafe_session")
    localStorage.removeItem("cybersafe_state")
    // Navigate to character creation
    router.push("/character-creation")
  }

  const handleContinueGame = () => {
    // Navigate directly to game tutorial
    router.push("/game/tutorial")
  }

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center terminal-border rounded-full p-4 bg-card mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2 terminal-glow">
            WELCOME BACK, <span className="text-primary">PLAYER</span>
          </h1>
          <p className="text-muted-foreground">Choose your path forward</p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* Continue Game Option */}
          {hasExistingGame && (
            <button
              onClick={handleContinueGame}
              className="w-full terminal-border bg-card hover:bg-primary/10 p-8 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-all">
                    <RotateCcw className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-2xl font-bold text-foreground mb-1">CONTINUE GAME</h2>
                  <p className="text-muted-foreground">Resume your journey as</p>
                  <p className="text-primary font-semibold text-lg">{existingUsername}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="text-primary group-hover:translate-x-2 transition-transform">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          )}

          {/* New Game Option */}
          <button
            onClick={handleNewGame}
            className="w-full terminal-border bg-card hover:bg-secondary/10 p-8 rounded-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-secondary/20 group-hover:bg-secondary/30 transition-all">
                  <Plus className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-2xl font-bold text-foreground mb-1">NEW GAME</h2>
                <p className="text-muted-foreground">
                  {hasExistingGame
                    ? "Start a fresh quest with a new player account"
                    : "Begin your cybersecurity journey"}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="text-secondary group-hover:translate-x-2 transition-transform">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 terminal-border bg-card/50 p-6 rounded-lg">
          <h3 className="text-sm font-semibold text-primary mb-2">HOW IT WORKS</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Each username creates a unique player account</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Your progress and scores are saved automatically</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>View your rank on the global leaderboard</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Start a new game to create a different player account</span>
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Button variant="link" onClick={() => router.push("/")} className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
