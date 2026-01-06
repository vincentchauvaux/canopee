'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      // Recharger la session au focus de la fenêtre
      refetchOnWindowFocus={true}
      // Recharger la session toutes les 5 minutes (optionnel)
      refetchInterval={5 * 60}
      // Base path pour NextAuth (utilise le domaine actuel)
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  )
}

