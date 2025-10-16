"use client"

import { useRef } from "react"
import { Shield, Award, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CertificateGeneratorProps {
  username?: string | null
  score: number
  rank: number
  completionDate: string
  achievements: number
}

export function CertificateGenerator({
  username,
  score,
  rank,
  completionDate,
  achievements,
}: CertificateGeneratorProps) {
  const certificateRef = useRef<HTMLDivElement>(null)

  const displayName = username || "Cyber Guardian"

  const downloadCertificate = async () => {
    if (!certificateRef.current) return

    try {
      // Create a canvas from the certificate
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: "#0a0a0a",
        scale: 2,
      })

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `cybersafe-quest-certificate-${displayName}.png`
          link.click()
          URL.revokeObjectURL(url)
        }
      })
    } catch (error) {
      console.error("Failed to generate certificate:", error)
    }
  }

  const getProtectionLevel = (score: number) => {
    if (score >= 90) return "EXPERT"
    if (score >= 75) return "ADVANCED"
    if (score >= 60) return "INTERMEDIATE"
    if (score >= 40) return "NOVICE"
    return "BEGINNER"
  }

  return (
    <div className="space-y-6">
      <div
        ref={certificateRef}
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 rounded-lg border-2 border-cyan-500/30"
      >
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-cyan-400" />

        {/* Content */}
        <div className="text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Shield className="w-20 h-20 mx-auto text-cyan-400" />
            <h1 className="text-4xl font-bold text-cyan-400 tracking-wider">CERTIFICATE OF COMPLETION</h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </div>

          {/* Body */}
          <div className="space-y-6 py-8">
            <p className="text-lg text-slate-300">This certifies that</p>
            <h2 className="text-5xl font-bold text-white tracking-wide">{displayName}</h2>
            <p className="text-lg text-slate-300">has successfully completed the</p>
            <h3 className="text-3xl font-bold text-cyan-400">CyberSafe Quest</h3>
            <p className="text-lg text-slate-300">Digital Security Training Program</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 py-8 border-t border-b border-cyan-500/30">
            <div>
              <div className="text-3xl font-bold text-cyan-400">{score}</div>
              <div className="text-sm text-slate-400">Security Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">{getProtectionLevel(score)}</div>
              <div className="text-sm text-slate-400">Protection Level</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">{achievements}</div>
              <div className="text-sm text-slate-400">Badges Earned</div>
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Award className="w-5 h-5" />
              <span>Global Rank: #{rank}</span>
            </div>
            <p className="text-sm text-slate-500">Completed on {new Date(completionDate).toLocaleDateString()}</p>
            <div className="text-xs text-slate-600 font-mono">DIGITAL UNIVERSITY • CYBERSAFE QUEST</div>
          </div>
        </div>
      </div>

      <Button
        onClick={downloadCertificate}
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
        size="lg"
      >
        <Download className="w-5 h-5 mr-2" />
        Download Certificate
      </Button>
    </div>
  )
}
