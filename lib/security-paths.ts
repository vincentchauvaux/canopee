/**
 * Chemins / motifs typiques de scans d'intrusion (WordPress, PHP, secrets…).
 * Réponse 404 sans révéler l'existence de ressources.
 */

const BLOCKED_EXACT = new Set([
  "/.env",
  "/.env.local",
  "/.env.production",
  "/.git",
  "/.git/config",
  "/.git/HEAD",
  "/wp-login.php",
  "/wp-admin",
  "/xmlrpc.php",
  "/phpmyadmin",
  "/admin.php",
  "/config.php",
  "/composer.json",
  "/package-lock.json",
  "/.DS_Store",
  "/server-status",
  "/actuator",
  "/actuator/health",
]);

const BLOCKED_PREFIXES = [
  "/.git/",
  "/wp-admin/",
  "/wp-content/",
  "/wp-includes/",
  "/phpmyadmin/",
  "/.well-known/acme-challenge/", // laisser ACME si besoin — commenté volontairement non
];

// Ne pas bloquer .well-known/security.txt (légitime)
const BLOCKED_SUFFIXES = [
  ".php",
  ".asp",
  ".aspx",
  ".jsp",
  ".cgi",
  ".env",
  ".sql",
  ".bak",
  ".old",
];

const BLOCKED_INCLUDES = [
  "wp-config",
  "eval-stdin",
  "shell.php",
  "passwd",
  "/etc/passwd",
  "vendor/phpunit",
  "actuator/",
];

export function isSuspiciousPath(pathname: string): boolean {
  const path = pathname.toLowerCase();

  if (BLOCKED_EXACT.has(path)) return true;

  // Accès légitime security.txt
  if (path === "/.well-known/security.txt") return false;

  for (const prefix of BLOCKED_PREFIXES) {
    if (prefix.includes("acme-challenge")) continue;
    if (path.startsWith(prefix)) return true;
  }

  for (const suffix of BLOCKED_SUFFIXES) {
    if (path.endsWith(suffix)) return true;
  }

  for (const needle of BLOCKED_INCLUDES) {
    if (path.includes(needle)) return true;
  }

  // Double extensions type file.php.jpg
  if (/\.(php|asp|aspx|jsp)\./i.test(path)) return true;

  return false;
}
