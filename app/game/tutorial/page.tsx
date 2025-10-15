"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { Shield, Lock, Fish, Link2, Wifi, ArrowRight } from "lucide-react"

export default function TutorialPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  const tutorialSteps = [
    {
      title: "Welcome to CyberSafe Quest",
      content:
        "You're about to embark on a journey through the digital world. Your mission: learn to protect yourself from cyber threats.",
      icon: Shield,
    },
    {
      title: "How It Works",
      content:
        "You'll face real-world scenarios where you must make security decisions. Each choice affects your security score and unlocks achievements.",
      icon: Lock,
    },
    {
      title: "Your Challenges",
      content:
        "Navigate through 4 chapters: Password Security, Phishing Detection, Link Safety, and Public WiFi Protection. Complete them all to become a Cyber Guardian!",
      icon: Fish,
    },
  ]

  const currentStep = tutorialSteps[step]
  const Icon = currentStep.icon

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1)
    } else {
      router.push("/game/journey")
    }
  }

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader title="MISSION BRIEFING" subtitle="Prepare for your digital journey" />

        <div className="terminal-border bg-card p-12 rounded-lg text-center">
          <div className="mb-8 flex justify-center">
            <div className="terminal-border rounded-full p-8 bg-background pulse-glow">
              <Icon className="h-20 w-20 text-primary" />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4 terminal-glow">{currentStep.title}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">{currentStep.content}</p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === step ? "bg-primary w-8" : index < step ? "bg-primary/50" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button size="lg" onClick={handleNext} className="terminal-border bg-primary hover:bg-primary/90">
            {step < tutorialSteps.length - 1 ? "NEXT" : "BEGIN QUEST"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Chapter Preview */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="terminal-border bg-card p-4 rounded-lg text-center">
            <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Chapter 1</div>
            <div className="text-xs text-muted-foreground">Password</div>
          </div>
          <div className="terminal-border bg-card p-4 rounded-lg text-center opacity-50">
            <Fish className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Chapter 2</div>
            <div className="text-xs text-muted-foreground">Phishing</div>
          </div>
          <div className="terminal-border bg-card p-4 rounded-lg text-center opacity-50">
            <Link2 className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Chapter 3</div>
            <div className="text-xs text-muted-foreground">Links</div>
          </div>
          <div className="terminal-border bg-card p-4 rounded-lg text-center opacity-50">
            <Wifi className="h-8 w-8 text-warning mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Chapter 4</div>
            <div className="text-xs text-muted-foreground">WiFi</div>
          </div>
        </div>
      </div>
    </div>
  )
}
