'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext'
import { GlobalAudioBar } from '@/components/admin/GlobalAudioBar'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchOnWindowFocus={true}
      refetchInterval={5 * 60}
      basePath="/api/auth"
    >
      <AudioPlayerProvider>
        {children}
        <GlobalAudioBar />
      </AudioPlayerProvider>
    </SessionProvider>
  )
}

