"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { CheckCircle, XCircle, Shield, Link2 } from "lucide-react"

export default function Chapter3ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const score = Number.parseInt(searchParams.get("score") || "0")
  const correct = Number.parseInt(searchParams.get("correct") || "0")
  const total = Number.parseInt(searchParams.get("total") || "3")

  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowResults(true), 500)
  }, [])

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader title="CHAPTER 3: RESULTS" subtitle="Link Safety Assessment" progress={75} />

        {showResults && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="terminal-border bg-card p-8 rounded-lg text-center">
              {score >= 70 ? (
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-success" />
              ) : (
                <XCircle className="h-16 w-16 mx-auto mb-4 text-warning" />
              )}
              <h2 className="text-4xl font-bold mb-2">YOUR SCORE: {score}/100</h2>
              <p className="text-lg text-muted-foreground">
                You correctly identified {correct} out of {total} links
              </p>
            </div>

            <div className="terminal-border bg-card p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">LINK SAFETY EDUCATION</h3>

              <div className="space-y-4">
                <div className="terminal-border bg-background p-4 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <Link2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg">How to Identify Suspicious Links</h4>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-9">
                    <li>
                      <strong className="text-foreground">Check the domain:</strong> Look for misspellings like "amaz0n"
                      instead of "amazon"
                    </li>
                    <li>
                      <strong className="text-foreground">Verify HTTPS:</strong> Secure sites use HTTPS, not HTTP
                    </li>
                    <li>
                      <strong className="text-foreground">Hover before clicking:</strong> See the actual destination URL
                    </li>
                    <li>
                      <strong className="text-foreground">Watch for subdomains:</strong> "login.paypal.scam.com" is NOT
                      PayPal
                    </li>
                    <li>
                      <strong className="text-foreground">Be wary of shortened URLs:</strong> They hide the real
                      destination
                    </li>
                  </ul>
                </div>

                <div className="terminal-border bg-background p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    Common Link Scams
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Fake delivery notifications with tracking links</li>
                    <li>• "Too good to be true" offers (free iPhones, gift cards)</li>
                    <li>• Urgent security alerts requiring immediate action</li>
                    <li>• Prize or lottery winning notifications</li>
                    <li>• Fake password reset requests</li>
                  </ul>
                </div>

                <div className="terminal-border bg-primary/20 border-primary p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-primary mb-2">Best Practices</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Always verify the sender before clicking any link</li>
                        <li>• Use link scanning tools or browser security extensions</li>
                        <li>• Type URLs directly instead of clicking links in emails</li>
                        <li>• Keep your browser and security software updated</li>
                        <li>• When in doubt, contact the organization directly</li>
                        <li>• Report suspicious links to your IT department</li>
                      </ul>
                    </div>
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
