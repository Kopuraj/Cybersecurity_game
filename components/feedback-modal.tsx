"use client"

import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeedbackModalProps {
  isCorrect: boolean
  title: string
  message: string
  points?: number
  onContinue: () => void
}

export function FeedbackModal({ isCorrect, title, message, points, onContinue }: FeedbackModalProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="terminal-border bg-card p-8 rounded-lg max-w-2xl w-full animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          {isCorrect ? (
            <div className="inline-flex items-center justify-center terminal-border rounded-full p-4 bg-success/20 mb-4">
              <CheckCircle className="h-16 w-16 text-success" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center terminal-border rounded-full p-4 bg-destructive/20 mb-4">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
          )}

          <h2 className={`text-3xl font-bold mb-2 ${isCorrect ? "text-success" : "text-destructive"}`}>{title}</h2>

          {points !== undefined && isCorrect && (
            <div className="text-primary text-xl font-bold mb-4">+{points} POINTS</div>
          )}
        </div>

        <div className="terminal-border bg-background p-6 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <p className="text-foreground leading-relaxed">{message}</p>
          </div>
        </div>

        <Button size="lg" className="w-full terminal-border bg-primary hover:bg-primary/90" onClick={onContinue}>
          CONTINUE
        </Button>
      </div>
    </div>
  )
}
