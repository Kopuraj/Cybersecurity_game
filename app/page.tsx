"use client"
import { Shield, Trophy, BookOpen, ArrowRight, Zap, Target, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen cyber-grid relative overflow-hidden">
      {/* Scan line effect */}
      <div className="scan-line" />

      {/* Background circuit pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-primary rounded-full" />
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-secondary rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/30 rounded-full" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        {/* Logo and Title */}
        <div className="mb-12 text-center">
          <div className="mb-8 flex justify-center">
            <div className="terminal-border rounded-full p-8 bg-card pulse-glow">
              <Shield className="h-24 w-24 text-primary" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="mb-4 text-7xl font-bold tracking-tight terminal-glow glitch">
            <span className="text-primary">CYBER</span>
            <span className="text-foreground">SAFE</span>
          </h1>
          <h2 className="text-5xl font-bold text-secondary mb-6">QUEST</h2>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-mono">
            FORTIFY YOUR DIGITAL FRONTIER
          </p>
          <p className="text-sm text-muted-foreground/70 mt-4 max-w-xl mx-auto">
            Master cybersecurity through interactive challenges. Learn to detect phishing, create secure passwords,
            identify suspicious links, and navigate public WiFi safely.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-md mb-12">
          <Button
            size="lg"
            className="terminal-border h-16 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
            onClick={() => router.push("/user-selection")}
          >
            START YOUR DIGITAL JOURNEY
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>

          <div className="grid grid-cols-2 gap-4">
            <Button
              size="lg"
              variant="outline"
              className="terminal-border h-14 text-base font-semibold border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
              onClick={() => router.push("/leaderboard")}
            >
              <Trophy className="mr-2 h-5 w-5" />
              LEADERBOARD
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="terminal-border h-14 text-base font-semibold border-accent text-accent hover:bg-accent/10 bg-transparent"
              onClick={() => router.push("/security-tips")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              TIPS
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl w-full">
          <div className="terminal-border bg-card p-6 rounded-lg hover:bg-card/80 transition-all">
            <Zap className="h-8 w-8 text-primary mb-3" />
            <div className="text-primary text-3xl font-bold mb-2">5-10</div>
            <div className="text-sm text-muted-foreground">Minutes to Complete</div>
          </div>

          <div className="terminal-border bg-card p-6 rounded-lg hover:bg-card/80 transition-all">
            <Target className="h-8 w-8 text-secondary mb-3" />
            <div className="text-secondary text-3xl font-bold mb-2">4</div>
            <div className="text-sm text-muted-foreground">Interactive Scenarios</div>
          </div>

          <div className="terminal-border bg-card p-6 rounded-lg hover:bg-card/80 transition-all">
            <Award className="h-8 w-8 text-accent mb-3" />
            <div className="text-accent text-3xl font-bold mb-2">8+</div>
            <div className="text-sm text-muted-foreground">Achievements to Unlock</div>
          </div>

          <div className="terminal-border bg-card p-6 rounded-lg hover:bg-card/80 transition-all">
            <Trophy className="h-8 w-8 text-warning mb-3" />
            <div className="text-warning text-3xl font-bold mb-2">100</div>
            <div className="text-sm text-muted-foreground">Max Security Score</div>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground/50 font-mono">
            [ DIGITAL UNIVERSITY • CYBERSECURITY EDUCATION INITIATIVE ]
          </p>
        </div>
      </main>
    </div>
  )
}
