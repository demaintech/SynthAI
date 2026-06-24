'use client'

import { usePathname } from 'next/navigation'
import { PromptProvider } from '@/context/PromptContext'
import NeuralCanvas from '@/components/NeuralCanvas'
import { Suspense } from 'react'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChat = pathname === '/chat'

  return (
    <PromptProvider>
      {/* Persistent Neural Canvas Background */}
      <Suspense fallback={null}>
        <NeuralCanvas opacity={isChat ? 0.3 : 1} />
      </Suspense>
      {children}
    </PromptProvider>
  )
}
