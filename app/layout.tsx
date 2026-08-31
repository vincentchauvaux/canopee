import type { Metadata } from 'next'
import { Inter, Montserrat, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Script from 'next/script'
import Header from '@/components/Header'
import CookieConsent from '@/components/CookieConsent'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Canopée - Studio de Yoga',
  description: 'Découvrez nos cours de yoga dans une atmosphère zen et bienveillante',
  keywords: 'yoga, méditation, bien-être, cours de yoga, studio, canopée',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${montserrat.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text x='16' y='22' text-anchor='middle' font-family='Georgia, serif' font-size='20' font-weight='700' fill='%23264E36'>C</text></svg>"
        />
        {/* Script pour supprimer les attributs ajoutés par les extensions */}
        <Script
          id="remove-extension-attributes"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  // Supprimer les attributs ajoutés par les extensions de navigateur
                  const removeExtensionAttributes = () => {
                    const body = document.body;
                    if (body) {
                      // Supprimer cz-shortcut-listen et autres attributs d'extensions
                      const extensionAttributes = ['cz-shortcut-listen', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed'];
                      extensionAttributes.forEach(attr => {
                        if (body.hasAttribute(attr)) {
                          body.removeAttribute(attr);
                        }
                      });
                    }
                  };
                  
                  // Exécuter immédiatement et après le chargement
                  removeExtensionAttributes();
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', removeExtensionAttributes);
                  } else {
                    removeExtensionAttributes();
                  }
                  
                  // Observer les changements pour supprimer ces attributs si ajoutés plus tard
                  const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                      if (mutation.type === 'attributes') {
                        const target = mutation.target;
                        if (target && target.nodeType === 1) {
                          const extensionAttributes = ['cz-shortcut-listen', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed'];
                          extensionAttributes.forEach(attr => {
                            if (target.hasAttribute(attr)) {
                              target.removeAttribute(attr);
                            }
                          });
                        }
                      }
                    });
                  });
                  
                  observer.observe(document.body, {
                    attributes: true,
                    attributeFilter: ['cz-shortcut-listen', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed']
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <Providers>
          <Header />
          {children}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  )
}
