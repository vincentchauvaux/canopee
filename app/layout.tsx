import type { Metadata } from 'next'
import { Manrope, Noto_Serif } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Script from 'next/script'
import StitchTopBar from '@/components/stitch/StitchTopBar'
import StitchBottomNav from '@/components/stitch/StitchBottomNav'
import StitchAuxFooter from '@/components/stitch/StitchAuxFooter'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
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
    <html
      lang="fr"
      className={`${manrope.variable} ${notoSerif.variable} scroll-smooth [scroll-padding-bottom:7.5rem]`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
        <Script
          id="remove-extension-attributes"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  const removeExtensionAttributes = () => {
                    const body = document.body;
                    if (body) {
                      const extensionAttributes = ['cz-shortcut-listen', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed'];
                      extensionAttributes.forEach(attr => {
                        if (body.hasAttribute(attr)) {
                          body.removeAttribute(attr);
                        }
                      });
                    }
                  };
                  removeExtensionAttributes();
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', removeExtensionAttributes);
                  } else {
                    removeExtensionAttributes();
                  }
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
      <body
        className="font-sans antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        <Providers>
          <StitchTopBar />
          <div className="pt-[4.75rem] pb-28 md:pb-32 min-h-dvh bg-surface">{children}</div>
          <StitchAuxFooter />
          <StitchBottomNav />
        </Providers>
      </body>
    </html>
  )
}
