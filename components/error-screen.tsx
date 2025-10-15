"use client"

import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ErrorScreenProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorScreen({
  title = "SYSTEM ERROR",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorScreenProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="terminal-border bg-card p-8 rounded-lg text-center space-y-6">
          <div className="flex justify-center">
            <div className="terminal-border rounded-full p-6 bg-destructive/20">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-destructive terminal-glow">{title}</h2>
            <p className="text-muted-foreground">{message}</p>
          </div>

          <div className="flex flex-col gap-3">
            {onRetry && (
              <Button onClick={onRetry} className="terminal-border bg-primary hover:bg-primary/90">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            <Button onClick={() => router.push("/")} variant="outline" className="terminal-border bg-transparent">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
