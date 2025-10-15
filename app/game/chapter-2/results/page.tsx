"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { CheckCircle, XCircle, AlertTriangle, Shield } from "lucide-react"

export default function Chapter2ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = searchParams.get("action")
  const isCorrect = searchParams.get("correct") === "true"
  const points = Number.parseInt(searchParams.get("points") || "0")

  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowResults(true), 500)
  }, [])

  const getActionFeedback = () => {
    switch (action) {
      case "mark_phishing":
        return {
          title: "EXCELLENT DETECTION!",
          description: "You correctly identified this as a phishing email.",
        }
      case "click_link":
        return {
          title: "DANGEROUS CHOICE!",
          description: "Clicking suspicious links can install malware or steal your credentials.",
        }
      case "forward":
        return {
          title: "GOOD THINKING!",
          description: "Forwarding to IT is smart, but marking as phishing is the best first action.",
        }
      case "reply":
        return {
          title: "NOT RECOMMENDED",
          description: "Replying confirms your email is active and can lead to more attacks.",
        }
      default:
        return { title: "", description: "" }
    }
  }

  const feedback = getActionFeedback()

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader title="CHAPTER 2: RESULTS" subtitle="Phishing Detection Assessment" progress={50} />

        {showResults && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="terminal-border bg-card p-8 rounded-lg text-center">
              {isCorrect ? (
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-success" />
              ) : (
                <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
              )}
              <h2 className="text-3xl font-bold mb-2">{feedback.title}</h2>
              <p className="text-lg text-muted-foreground mb-4">{feedback.description}</p>
              <p className="text-2xl font-bold">POINTS EARNED: {points}/25</p>
            </div>

            <div className="terminal-border bg-card p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">PHISHING RED FLAGS IN THIS EMAIL</h3>

              <div className="space-y-3 mb-6">
                <div className="terminal-border bg-background p-4 rounded flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-destructive">Suspicious Sender Address</p>
                    <p className="text-sm text-muted-foreground">
                      "campus.net-alerts.com" is NOT the official campus domain. Always verify sender addresses
                      carefully.
                    </p>
                  </div>
                </div>

                <div className="terminal-border bg-background p-4 rounded flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-destructive">Urgent/Threatening Language</p>
                    <p className="text-sm text-muted-foreground">
                      "SUSPENDED within 24 hours" creates panic to rush your decision. Legitimate organizations don't
                      threaten immediate action.
                    </p>
                  </div>
                </div>

                <div className="terminal-border bg-background p-4 rounded flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-destructive">Suspicious Link</p>
                    <p className="text-sm text-muted-foreground">
                      "verify-campus.net-alerts.com" is a fake domain designed to steal credentials. Always hover over
                      links before clicking.
                    </p>
                  </div>
                </div>

                <div className="terminal-border bg-background p-4 rounded flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-destructive">Generic Greeting</p>
                    <p className="text-sm text-muted-foreground">
                      "Dear Student" instead of your name. Legitimate emails from your institution use your actual name.
                    </p>
                  </div>
                </div>
              </div>

              <div className="terminal-border bg-primary/20 border-primary p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-primary mb-2">HOW TO PROTECT YOURSELF</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Always verify sender email addresses match official domains</li>
                      <li>• Never click links in unexpected or urgent emails</li>
                      <li>• Contact organizations directly through official channels if unsure</li>
                      <li>• Enable email filters and spam protection</li>
                      <li>• Report phishing attempts to your IT department</li>
                      <li>• Look for HTTPS and padlock icons on websites</li>
                    </ul>
                  </div>
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
