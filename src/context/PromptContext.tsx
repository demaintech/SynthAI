'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'

interface PromptContextType {
  pendingPrompt: string
  setPendingPrompt: (prompt: string) => void
}

const PromptContext = createContext<PromptContextType>({
  pendingPrompt: '',
  setPendingPrompt: () => {},
})

export function PromptProvider({ children }: { children: ReactNode }) {
  const [pendingPrompt, setPendingPrompt] = useState('')

  return (
    <PromptContext.Provider value={{ pendingPrompt, setPendingPrompt }}>
      {children}
    </PromptContext.Provider>
  )
}

export function usePrompt() {
  return useContext(PromptContext)
}
