"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { CheckCircle, XCircle, AlertCircle, Trophy } from "lucide-react"

export default function Chapter1ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const score = Number.parseInt(searchParams.get("score") || "0")

  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowResults(true), 500)
  }, [])

  const getPerformance = () => {
    if (score >= 80) return { level: "EXPERT", color: "text-success", icon: Trophy }
    if (score >= 60) return { level: "INTERMEDIATE", color: "text-warning", icon: AlertCircle }
    return { level: "NOVICE", color: "text-destructive", icon: XCircle }
  }

  const performance = getPerformance()
  const Icon = performance.icon

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader title="CHAPTER 1: RESULTS" subtitle="Password Security Assessment" progress={25} />

        {showResults && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Score Display */}
            <div className="terminal-border bg-card p-8 rounded-lg text-center">
              <Icon className={`h-16 w-16 mx-auto mb-4 ${performance.color}`} />
              <h2 className="text-4xl font-bold mb-2">YOUR SCORE: {score}/100</h2>
              <p className={`text-2xl font-bold ${performance.color}`}>{performance.level}</p>
            </div>

            {/* Educational Feedback */}
            <div className="terminal-border bg-card p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">WHAT YOU SHOULD KNOW</h3>

              <div className="space-y-4">
                <div className="terminal-border bg-background p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Strong Password Characteristics
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                    <li>• At least 12-16 characters long</li>
                    <li>• Mix of uppercase and lowercase letters</li>
                    <li>• Contains numbers and special characters (!@#$%)</li>
                    <li>• Avoids common words, names, or dates</li>
                    <li>• Unique for each account</li>
                  </ul>
                </div>

                <div className="terminal-border bg-background p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    Common Password Mistakes
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                    <li>• Using personal information (birthdays, names)</li>
                    <li>• Simple patterns (123456, qwerty, password)</li>
                    <li>• Reusing passwords across multiple sites</li>
                    <li>• Short passwords (less than 8 characters)</li>
                    <li>• Dictionary words without modifications</li>
                  </ul>
                </div>

                <div className="terminal-border bg-background p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    Pro Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                    <li>• Use a password manager to generate and store complex passwords</li>
                    <li>• Enable two-factor authentication (2FA) whenever possible</li>
                    <li>• Change passwords immediately if a breach is suspected</li>
                    <li>• Create passphrases: "Coffee!Morning@2024#Sunshine"</li>
                    <li>• Never share passwords via email or text</li>
                  </ul>
                </div>

                <div className="terminal-border bg-primary/20 border-primary p-4 rounded-lg">
                  <p className="text-sm">
                    <strong className="text-primary">Did you know?</strong> A 12-character password with mixed case,
                    numbers, and symbols would take a computer approximately 34,000 years to crack using brute force
                    methods!
                  </p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => router.push("/game/journey")}
              className="w-full terminal-border bg-primary hover:bg-primary/90"
            >
              CONTINUE TO NEXT CHALLENGE
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
