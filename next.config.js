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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
  // Export statique (décommenter si vous utilisez le Pack Starter)
  // output: 'export',
};

module.exports = nextConfig;
