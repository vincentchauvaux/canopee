/**
 * Sanitize HTML basique (allowlist) — sans dépendance externe.
 * Supprime scripts, event handlers, javascript:, iframes, etc.
 */

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "a",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "span",
  "div",
]);

const VOID_TAGS = new Set(["br"]);

function isSafeHref(href: string): boolean {
  const trimmed = href.trim().toLowerCase();
  if (!trimmed) return false;
  if (trimmed.startsWith("javascript:")) return false;
  if (trimmed.startsWith("data:")) return false;
  if (trimmed.startsWith("vbscript:")) return false;
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("#")
  );
}

function escapeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sanitize une chaîne HTML pour affichage sûr via dangerouslySetInnerHTML.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";

  // Retirer les blocs dangereux entiers
  let html = dirty
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "")
    .replace(/<link[\s\S]*?>/gi, "")
    .replace(/<meta[\s\S]*?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Parser tag par tag
  const tokenRe = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>|([^<]+)/g;
  let out = "";
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(html)) !== null) {
    if (match[3] !== undefined) {
      out += escapeText(match[3]);
      continue;
    }

    const tagName = (match[1] || "").toLowerCase();
    const rawAttrs = match[2] || "";
    const isClosing = match[0].startsWith("</");

    if (!ALLOWED_TAGS.has(tagName)) {
      continue;
    }

    if (isClosing) {
      if (!VOID_TAGS.has(tagName)) out += `</${tagName}>`;
      continue;
    }

    if (VOID_TAGS.has(tagName)) {
      out += `<${tagName}>`;
      continue;
    }

    if (tagName === "a") {
      const hrefMatch = rawAttrs.match(/href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const href = hrefMatch
        ? hrefMatch[2] ?? hrefMatch[3] ?? hrefMatch[4] ?? ""
        : "";
      if (href && isSafeHref(href)) {
        const safe = escapeText(href);
        out += `<a href="${safe}" rel="noopener noreferrer" target="_blank">`;
      } else {
        out += "<span>";
      }
      continue;
    }

    out += `<${tagName}>`;
  }

  return out;
}

/** URL image sûre (http/https relative ou data:image jpeg/png/webp/gif borné). */
export function isSafeImageUrl(value: string | null | undefined): boolean {
  if (!value) return true;
  const v = value.trim();
  if (!v) return true;

  if (v.startsWith("data:image/")) {
    const allowed = /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(v);
    if (!allowed) return false;
    // ~500 KB base64
    if (v.length > 700_000) return false;
    return true;
  }

  try {
    if (v.startsWith("/")) {
      // chemin relatif local — pas de protocole
      return !v.includes("..") && !/[<>"']/.test(v);
    }
    const url = new URL(v);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
