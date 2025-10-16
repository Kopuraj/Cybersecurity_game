"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TerminalHeader } from "@/components/terminal-header"
import { Eye, EyeOff, Shield, AlertTriangle, Skull } from "lucide-react"
import { useGame } from "@/lib/game-context"
import { analyzePasswordSecurity, checkAchievementUnlock } from "@/lib/scoring"
import { updateChapterProgress, updateSessionScores, recordDecision, unlockAchievement } from "@/lib/api"

export default function Chapter1Page() {
  const router = useRouter()
  const { gameState, updateGameState } = useGame()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState("")

  const [passwordAnalysis, setPasswordAnalysis] = useState<any>(null)
  const [isHacking, setIsHacking] = useState(false)
  const [hackingStage, setHackingStage] = useState(0)
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    if (password.length > 0) {
      const analysis = analyzePasswordSecurity(password, accountType)
      setPasswordAnalysis(analysis)
    } else {
      setPasswordAnalysis(null)
    }
  }, [password, accountType])

  const simulateHackingAttempt = async () => {
    if (!passwordAnalysis || passwordAnalysis.score >= 70) return

    setIsHacking(true)
    setHackingStage(0)

    // Stage 1: Cracking notification
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setHackingStage(1)

    // Stage 2: Account accessed
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setHackingStage(2)

    // Stage 3: Damage done
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setHackingStage(3)

    // Stage 4: Real-world impact
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setHackingStage(4)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword || !accountType) {
      alert("Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    const analysis = analyzePasswordSecurity(password, accountType)
    const score = analysis.score

    if (score < 70) {
      await simulateHackingAttempt()
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    // Record decision
    if (gameState.sessionId) {
      await recordDecision({
        session_id: gameState.sessionId,
        chapter_id: 1,
        decision_type: "password_creation",
        decision_value: JSON.stringify({
          length: password.length,
          score,
          crackTime: analysis.crackTime,
          accountType,
        }),
        is_correct: score >= 70,
        points_earned: score,
        feedback_shown: analysis.weaknessType,
      })

      await updateSessionScores(gameState.sessionId, {
        password_score: score,
      })

      const achievement = checkAchievementUnlock("password_pro", { length: password.length, score })
      if (achievement.unlocked) {
        await unlockAchievement(gameState.sessionId, achievement.achievementId)
      }

      await updateChapterProgress(gameState.sessionId, 1, {
        status: "completed",
        score,
      })

      updateGameState({ passwordScore: score })
    }

    router.push(
      `/game/chapter-1/results?score=${score}&crackTime=${encodeURIComponent(analysis.crackTime)}&accountType=${accountType}`,
    )
  }

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader
          title="CHAPTER 1: SECURE ACCOUNT CREATION"
          subtitle="Create a password that can withstand real attacks"
          progress={25}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 terminal-border bg-card p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-primary">CREATE YOUR ACCOUNT</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <select
                  id="accountType"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full terminal-border bg-input text-foreground p-2 rounded-md"
                  required
                >
                  <option value="">Select account type...</option>
                  <option value="social">Social Media Account</option>
                  <option value="banking">Banking Account</option>
                  <option value="email">Email Account</option>
                  <option value="work">Work Account</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="terminal-border bg-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="terminal-border bg-input pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="terminal-border bg-input"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full terminal-border bg-primary hover:bg-primary/90"
                disabled={isHacking}
              >
                {isHacking ? "SIMULATING ATTACK..." : "CREATE ACCOUNT"}
              </Button>

              {passwordAnalysis && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => setShowComparison(!showComparison)}
                >
                  {showComparison ? "Hide" : "Show"} Password Comparison
                </Button>
              )}
            </form>
          </div>

          {/* Real-time Security Analysis Sidebar */}
          <div className="space-y-4">
            {passwordAnalysis && (
              <>
                <div className="terminal-border bg-card p-4 rounded-lg">
                  <h3 className="text-sm font-bold mb-2 text-muted-foreground">CRACK TIME ESTIMATE</h3>
                  <div
                    className={`text-2xl font-bold ${
                      passwordAnalysis.riskLevel === "EXTREME"
                        ? "text-red-500"
                        : passwordAnalysis.riskLevel === "HIGH"
                          ? "text-orange-500"
                          : passwordAnalysis.riskLevel === "MEDIUM"
                            ? "text-yellow-500"
                            : "text-green-500"
                    }`}
                  >
                    {passwordAnalysis.crackTime}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">Risk Level: {passwordAnalysis.riskLevel}</div>
                </div>

                <div className="terminal-border bg-card p-4 rounded-lg">
                  <h3 className="text-sm font-bold mb-2 text-muted-foreground">SECURITY SCORE</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordAnalysis.score >= 80
                            ? "bg-green-500"
                            : passwordAnalysis.score >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${passwordAnalysis.score}%` }}
                      />
                    </div>
                    <span className="text-xl font-bold">{passwordAnalysis.score}</span>
                  </div>
                </div>

                <div className="terminal-border bg-card p-4 rounded-lg">
                  <h3 className="text-sm font-bold mb-2 text-muted-foreground">HACKER SUCCESS RATE</h3>
                  <div className="text-2xl font-bold text-red-500">{passwordAnalysis.hackerSuccessRate}%</div>
                  <div className="mt-2 text-xs text-muted-foreground">Probability of successful attack</div>
                </div>

                {accountType && (
                  <div className="terminal-border bg-card p-4 rounded-lg">
                    <h3 className="text-sm font-bold mb-2 text-muted-foreground">POTENTIAL LOSS</h3>
                    <div className="text-xl font-bold text-orange-500">
                      ${passwordAnalysis.potentialLoss.toLocaleString()}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Estimated financial damage</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {showComparison && passwordAnalysis && (
          <div className="mt-6 terminal-border bg-card p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-primary">PASSWORD COMPARISON</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="font-bold">Your Password</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Crack Time: <span className="text-red-500 font-bold">{passwordAnalysis.crackTime}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Security Score: <span className="text-red-500 font-bold">{passwordAnalysis.score}/100</span>
                </div>
              </div>
              <div className="p-4 border border-green-500/30 rounded-lg bg-green-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="font-bold">Strong Alternative</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Crack Time: <span className="text-green-500 font-bold">10,000+ years</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Security Score: <span className="text-green-500 font-bold">95/100</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Improvement Tip:</strong> {passwordAnalysis.improvementTip}
              </p>
            </div>
          </div>
        )}

        {isHacking && (
          <div className="mt-6 terminal-border bg-red-950/50 border-red-500 p-6 rounded-lg animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <Skull className="h-8 w-8 text-red-500 animate-bounce" />
              <h3 className="text-xl font-bold text-red-500">HACKING SIMULATION IN PROGRESS</h3>
            </div>

            {hackingStage >= 1 && (
              <div className="mb-3 p-3 bg-red-900/30 rounded border-l-4 border-red-500">
                <div className="font-bold text-red-400">STAGE 1: PASSWORD CRACKED</div>
                <div className="text-sm text-muted-foreground mt-1">{passwordAnalysis?.hackMessage}</div>
              </div>
            )}

            {hackingStage >= 2 && (
              <div className="mb-3 p-3 bg-red-900/30 rounded border-l-4 border-red-500">
                <div className="font-bold text-red-400">STAGE 2: ACCOUNT ACCESSED</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Attacker gained full access to your {accountType} account
                </div>
              </div>
            )}

            {hackingStage >= 3 && (
              <div className="mb-3 p-3 bg-red-900/30 rounded border-l-4 border-red-500">
                <div className="font-bold text-red-400">STAGE 3: DAMAGE INITIATED</div>
                <div className="text-sm text-muted-foreground mt-1">{passwordAnalysis?.consequences[0]}</div>
              </div>
            )}

            {hackingStage >= 4 && (
              <div className="mb-3 p-3 bg-red-900/30 rounded border-l-4 border-red-500">
                <div className="font-bold text-red-400">STAGE 4: REAL-WORLD IMPACT</div>
                <div className="text-sm text-muted-foreground mt-1">{passwordAnalysis?.consequences[1]}</div>
                <div className="text-sm text-orange-500 font-bold mt-2">
                  Estimated Loss: ${passwordAnalysis?.potentialLoss.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
