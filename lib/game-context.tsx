"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface GameState {
  userId: number | null
  sessionId: number | null
  username: string | null
  avatarId: number | null
  currentChapter: number
  overallScore: number
  passwordScore: number
  phishingScore: number
  linkSafetyScore: number
  networkScore: number
  achievements: number[]
}

interface GameContextType {
  gameState: GameState
  updateGameState: (updates: Partial<GameState>) => void
  resetGame: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const initialState: GameState = {
  userId: null,
  sessionId: null,
  username: null,
  avatarId: null,
  currentChapter: 0,
  overallScore: 0,
  passwordScore: 0,
  phishingScore: 0,
  linkSafetyScore: 0,
  networkScore: 0,
  achievements: [],
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialState)

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("cybersafe_user")
    const savedSession = localStorage.getItem("cybersafe_session")
    const savedState = localStorage.getItem("cybersafe_state")

    if (savedUser && savedSession) {
      const user = JSON.parse(savedUser)
      setGameState((prev) => ({
        ...prev,
        userId: user.user_id,
        username: user.username,
        avatarId: user.avatar_id,
        sessionId: Number.parseInt(savedSession),
        ...(savedState ? JSON.parse(savedState) : {}),
      }))
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    if (gameState.sessionId) {
      localStorage.setItem("cybersafe_state", JSON.stringify(gameState))
    }
  }, [gameState])

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }))
  }

  const resetGame = () => {
    localStorage.removeItem("cybersafe_user")
    localStorage.removeItem("cybersafe_session")
    localStorage.removeItem("cybersafe_state")
    setGameState(initialState)
  }

  return <GameContext.Provider value={{ gameState, updateGameState, resetGame }}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within GameProvider")
  }
  return context
}
