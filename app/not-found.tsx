"use client"

import { Shield, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="terminal-border bg-card p-12 rounded-lg space-y-6">
          <div className="flex justify-center">
            <Shield className="h-24 w-24 text-primary opacity-50" />
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-primary terminal-glow">404</h1>
            <h2 className="text-2xl font-bold text-foreground">PAGE NOT FOUND</h2>
            <p className="text-muted-foreground">The page you're looking for doesn't exist in this digital realm.</p>
          </div>

          <Button onClick={() => router.push("/")} className="terminal-border bg-primary hover:bg-primary/90" size="lg">
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
