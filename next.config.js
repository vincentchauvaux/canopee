/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'www.lunopia.com'],
  },
  // Supprimer les warnings pour les attributs ajoutés par les extensions de navigateur
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Ignorer les attributs non-standard ajoutés par les extensions
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig

