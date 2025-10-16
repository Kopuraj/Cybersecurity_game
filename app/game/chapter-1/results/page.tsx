"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { CheckCircle, XCircle, AlertCircle, Trophy, Shield, DollarSign, Clock, Target } from "lucide-react"

export default function Chapter1ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const score = Number.parseInt(searchParams.get("score") || "0")
  const crackTime = searchParams.get("crackTime") || "Unknown"
  const accountType = searchParams.get("accountType") || "account"

  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowResults(true), 500)
  }, [])

  const getPerformance = () => {
    if (score >= 80)
      return {
        level: "EXPERT",
        color: "text-green-500",
        icon: Trophy,
        message: "Excellent! Your password is highly secure.",
      }
    if (score >= 60)
      return {
        level: "INTERMEDIATE",
        color: "text-yellow-500",
        icon: AlertCircle,
        message: "Good, but there's room for improvement.",
      }
    return { level: "NOVICE", color: "text-red-500", icon: XCircle, message: "Your password is vulnerable to attacks." }
  }

  const getImpactMetrics = () => {
    const recoveryDays = score >= 80 ? 0 : score >= 60 ? 7 : 30
    const financialLoss = score >= 80 ? 0 : score >= 60 ? 500 : 5000
    const accountsCompromised = score >= 80 ? 0 : score >= 60 ? 2 : 5

    return { recoveryDays, financialLoss, accountsCompromised }
  }

  const performance = getPerformance()
  const impact = getImpactMetrics()
  const Icon = performance.icon

  const getAccountConsequences = () => {
    const consequences: Record<string, string[]> = {
      social: [
        "Fake posts sent to friends and family",
        "Personal photos and messages exposed",
        "Account used for spam and scams",
      ],
      banking: ["Unauthorized money transfers", "Credit card fraud", "Identity theft for loans"],
      email: ["All account passwords reset by attacker", "Confidential emails accessed", "Email used to scam contacts"],
      work: ["Company data breach", "Client information stolen", "Potential job termination"],
    }
    return consequences[accountType] || consequences.social
  }

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
              <p className={`text-2xl font-bold ${performance.color} mb-2`}>{performance.level}</p>
              <p className="text-muted-foreground">{performance.message}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="terminal-border bg-card p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold text-muted-foreground">CRACK TIME</span>
                </div>
                <div
                  className={`text-2xl font-bold ${score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500"}`}
                >
                  {crackTime}
                </div>
              </div>

              <div className="terminal-border bg-card p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold text-muted-foreground">RISK LEVEL</span>
                </div>
                <div
                  className={`text-2xl font-bold ${score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500"}`}
                >
                  {score >= 80 ? "LOW" : score >= 60 ? "MEDIUM" : "HIGH"}
                </div>
              </div>

              <div className="terminal-border bg-card p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold text-muted-foreground">POTENTIAL LOSS</span>
                </div>
                <div className={`text-2xl font-bold ${impact.financialLoss === 0 ? "text-green-500" : "text-red-500"}`}>
                  ${impact.financialLoss.toLocaleString()}
                </div>
              </div>

              <div className="terminal-border bg-card p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold text-muted-foreground">RECOVERY TIME</span>
                </div>
                <div
                  className={`text-2xl font-bold ${impact.recoveryDays === 0 ? "text-green-500" : "text-orange-500"}`}
                >
                  {impact.recoveryDays === 0 ? "N/A" : `${impact.recoveryDays} days`}
                </div>
              </div>
            </div>

            {score < 70 && (
              <div className="terminal-border border-red-500 bg-red-950/30 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  WHAT COULD HAVE HAPPENED
                </h3>

                <div className="space-y-3">
                  <div className="p-4 bg-red-900/20 rounded border-l-4 border-red-500">
                    <div className="font-bold text-red-400 mb-1">Compromised Accounts</div>
                    <div className="text-sm text-muted-foreground">
                      {impact.accountsCompromised} accounts could be accessed if you reused this password
                    </div>
                  </div>

                  <div className="p-4 bg-red-900/20 rounded border-l-4 border-red-500">
                    <div className="font-bold text-red-400 mb-1">Immediate Consequences</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {getAccountConsequences().map((consequence, idx) => (
                        <li key={idx}>• {consequence}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-red-900/20 rounded border-l-4 border-red-500">
                    <div className="font-bold text-red-400 mb-1">Financial Impact</div>
                    <div className="text-sm text-muted-foreground">
                      Estimated loss: ${impact.financialLoss.toLocaleString()} from unauthorized access and recovery
                      costs
                    </div>
                  </div>

                  <div className="p-4 bg-red-900/20 rounded border-l-4 border-red-500">
                    <div className="font-bold text-red-400 mb-1">Recovery Process</div>
                    <div className="text-sm text-muted-foreground">
                      {impact.recoveryDays} days to secure all accounts, change passwords, and restore access
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Educational Feedback */}
            <div className="terminal-border bg-card p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">WHAT YOU SHOULD KNOW</h3>

              <div className="space-y-4">
                <div className="terminal-border bg-background p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
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
                    <XCircle className="h-5 w-5 text-red-500" />
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
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Pro Tips for Maximum Security
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
                  <h4 className="font-bold mb-2 text-primary">Real-World Statistics</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• 81% of data breaches are caused by weak or stolen passwords</p>
                    <p>• A 12-character password with mixed characters takes 34,000 years to crack</p>
                    <p>• The average cost of a data breach is $4.35 million</p>
                    <p>• 65% of people reuse passwords across multiple accounts</p>
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
