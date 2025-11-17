/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "www.lunopia.com", "canopee.be", "canopée.be"],
    // Pour l'export statique, désactiver l'optimisation
    unoptimized: process.env.NEXT_PUBLIC_STATIC_EXPORT === "true",
  },
  // Supprimer les warnings pour les attributs ajoutés par les extensions de navigateur
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Ignorer les attributs non-standard ajoutés par les extensions
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Export statique (décommenter si vous utilisez le Pack Starter)
  // output: 'export',
};

module.exports = nextConfig;
