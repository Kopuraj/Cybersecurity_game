"use client"

import { useState } from "react"
import { Share2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ShareScoreProps {
  username: string
  score: number
  rank: number
}

export function ShareScore({ username, score, rank }: ShareScoreProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `I just completed CyberSafe Quest with a security score of ${score}/100 and ranked #${rank} globally! 🛡️ Test your cybersecurity knowledge at Digital University.`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, "_blank")
  }

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`
    window.open(url, "_blank")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent">
          <Share2 className="w-4 h-4 mr-2" />
          Share Score
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Share Your Achievement</DialogTitle>
          <DialogDescription className="text-slate-400">
            Let others know about your cybersecurity skills!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share text preview */}
          <div className="p-4 bg-slate-800 rounded-lg border border-cyan-500/20">
            <p className="text-sm text-slate-300">{shareText}</p>
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={shareOnTwitter} className="bg-blue-500 hover:bg-blue-600 text-white">
              Share on Twitter
            </Button>
            <Button onClick={shareOnLinkedIn} className="bg-blue-700 hover:bg-blue-800 text-white">
              Share on LinkedIn
            </Button>
          </div>

          {/* Copy button */}
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
