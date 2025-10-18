"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, User, Mail, ArrowRight } from "lucide-react"
import { createUser, startGameSession } from "@/lib/api"

const AVATARS = [
  { id: 1, icon: "🛡️", name: "Guardian" },
  { id: 2, icon: "🔐", name: "Sentinel" },
  { id: 3, icon: "🔒", name: "Defender" },
  { id: 4, icon: "🗝️", name: "Keeper" },
]

export default function CharacterCreation() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(1)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || username.length < 2 || username.length > 20) {
      setError("Username must be between 2 and 20 characters")
      return
    }

    setLoading(true)

    try {
      // Create user
      const userResponse = await createUser({
        username,
        email: email || undefined,
        avatar_id: selectedAvatar,
      })

      // Start game session
      const sessionResponse = await startGameSession(userResponse.user.user_id)

      // Store session info in localStorage
      localStorage.setItem("cybersafe_user", JSON.stringify(userResponse.user))
      localStorage.setItem("cybersafe_session", sessionResponse.session_id.toString())

      // Navigate to game
      router.push("/game/tutorial")
    } catch (err: any) {
      setError(err.message || "Failed to create profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center terminal-border rounded-full p-4 bg-card mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2 terminal-glow">
            CREATE YOUR <span className="text-primary">DIGITAL IDENTITY</span>
          </h1>
          <p className="text-muted-foreground">Begin your cybersecurity journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="terminal-border bg-card p-8 rounded-lg space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="terminal-border bg-input text-foreground"
              maxLength={20}
              required
            />
            <p className="text-xs text-muted-foreground">2-20 characters, alphanumeric</p>
          </div>

          {/* Email (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-secondary" />
              Email (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="terminal-border bg-input text-foreground"
            />
          </div>

          {/* Avatar Selection */}
          <div className="space-y-3">
            <Label className="text-foreground">Choose Your Avatar</Label>
            <div className="grid grid-cols-4 gap-4">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`terminal-border p-4 rounded-lg transition-all ${
                    selectedAvatar === avatar.id
                      ? "bg-primary/20 border-primary shadow-lg shadow-primary/50"
                      : "bg-card hover:bg-muted"
                  }`}
                >
                  <div className="text-4xl mb-2">{avatar.icon}</div>
                  <div className="text-xs text-muted-foreground">{avatar.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="terminal-border border-destructive bg-destructive/10 p-3 rounded text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full terminal-border bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={loading}
          >
            {loading ? "CREATING PROFILE..." : "BEGIN QUEST"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Button variant="link" onClick={() => router.push("/user-selection")} className="text-muted-foreground">
            ← Back to Selection
          </Button>
        </div>
      </div>
    </div>
  )
}
