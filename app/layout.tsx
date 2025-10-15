import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { GameProvider } from "@/lib/game-context"

export const metadata: Metadata = {
  title: "CyberSafe Quest - Digital Security Training",
  description: "Interactive cybersecurity education game - Learn to protect yourself online",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <div className="scan-line" />
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  )
}
