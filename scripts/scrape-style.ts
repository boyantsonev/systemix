/**
 * scrape-style.ts
 *
 * Fetches a URL, extracts its visual identity (colors, typography, radius),
 * and maps findings to Systemix token structure.
 *
 * Usage:
 *   npx tsx scripts/scrape-style.ts <url>
 *   npx tsx scripts/scrape-style.ts https://multica.ai
 *
 * Output: JSON to stdout so the /style-match skill can consume it.
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const url = process.argv[2];
if (!url) {
  console.error("Usage: npx tsx scripts/scrape-style.ts <url>");
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isAbsoluteUrl(s: string): boolean {
  return s.startsWith("http://") || s.startsWith("https://");
}

function resolveUrl(base: string, path: string): string {
  try { return new URL(path, base).href; } catch { return path; }
}

/** Parse all :root { --var: value } blocks from raw CSS text */
function parseCustomProperties(css: string): Record<string, string> {
  const props: Record<string, string> = {};
  // Match :root { ... } blocks (may be multiline)
  const rootBlocks = css.match(/:root\s*\{([^}]+)\}/g) ?? [];
  for (const block of rootBlocks) {
    const inner = block.replace(/:root\s*\{/, "").replace(/\}$/, "");
    const lines = inner.split(";");
    for (const line of lines) {
      const m = line.match(/^\s*(--[\w-]+)\s*:\s*(.+?)\s*$/);
      if (m) props[m[1].trim()] = m[2].trim();
    }
  }
  return props;
}

/** Extract hex / rgba / hsl / oklch / lab color values */
function isColor(v: string): boolean {
  return /^(#[0-9a-f]{3,8}|rgba?\(|hsl[a]?\(|oklch\(|oklab?\(|lab\(|lch\(|color\(|hwb\(|p3\()/i.test(v.trim());
}

/** Convert any CSS color to a best-effort hex for display */
function colorPreview(v: string): string {
  // Just return as-is; actual conversion done via culori in the UI
  return v.trim();
}

/** Map extracted CSS custom properties to Systemix token names */
function mapToSystemixTokens(props: Record<string, string>): Record<string, string> {
  // Priority mapping: try exact Systemix var names first, then heuristic
  const exact: Record<string, string> = {};

  // Direct matches — site uses the same var names we do
  const SYSTEMIX_VARS = [
    "--background", "--foreground", "--primary", "--primary-foreground",
    "--secondary", "--secondary-foreground", "--muted", "--muted-foreground",
    "--accent", "--accent-foreground", "--destructive", "--border",
    "--input", "--ring", "--radius", "--card", "--card-foreground",
    "--popover", "--popover-foreground",
  ];
  for (const v of SYSTEMIX_VARS) {
    if (props[v]) exact[v] = props[v];
  }

  // Heuristic mapping when var names differ
  const heuristics: [string[], string][] = [
    [["--bg", "--background-color", "--bg-color", "--page-bg"], "--background"],
    [["--color-bg", "--color-background"], "--background"],
    [["--text", "--text-color", "--fg", "--foreground-color"], "--foreground"],
    [["--color-text", "--color-foreground"], "--foreground"],
    [["--brand", "--accent-color", "--highlight", "--color-accent-1", "--primary-color", "--color-primary"], "--primary"],
    [["--border-color", "--color-border", "--stroke"], "--border"],
    [["--border-radius", "--radius-base", "--rounded", "--br"], "--radius"],
    [["--card-bg", "--card-background", "--surface", "--panel-bg"], "--card"],
    [["--muted-color", "--text-muted", "--text-secondary", "--subtle"], "--muted-foreground"],
  ];
  for (const [candidates, target] of heuristics) {
    if (exact[target]) continue; // already have a direct match
    for (const c of candidates) {
      if (props[c]) { exact[target] = props[c]; break; }
    }
  }

  return exact;
}

/** Extract font-family values */
function extractFonts(css: string): string[] {
  const fonts: string[] = [];
  const bodyMatch = css.match(/body\s*\{[^}]*font-family\s*:\s*([^;]+)/);
  const rootMatch = css.match(/:root\s*\{[^}]*--font[^:]*:\s*([^;]+)/g);
  if (bodyMatch) fonts.push(bodyMatch[1].trim());
  if (rootMatch) {
    for (const m of rootMatch) {
      const v = m.match(/:\s*([^;]+)$/);
      if (v) fonts.push(v[1].trim());
    }
  }
  return [...new Set(fonts)].slice(0, 3);
}

// ── Fetch + Extract ───────────────────────────────────────────────────────────

async function run() {
  process.stderr.write(`Fetching ${url}...\n`);

  // 1. Fetch HTML
  let html: string;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Systemix/1.0; style-matcher)" },
      signal: AbortSignal.timeout(15_000),
    });
    html = await res.text();
  } catch (e) {
    console.error(JSON.stringify({ error: `Failed to fetch ${url}: ${String(e)}` }));
    process.exit(1);
  }

  // 2. Find CSS file URLs
  const cssUrls: string[] = [];
  const linkRe = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi;
  const styleHrefRe = /<link[^>]+href=["']([^"']+\.css[^"']*)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(html))) cssUrls.push(resolveUrl(url, m[1]));
  while ((m = styleHrefRe.exec(html))) {
    const resolved = resolveUrl(url, m[1]);
    if (!cssUrls.includes(resolved)) cssUrls.push(resolved);
  }

  // 3. Fetch CSS files (first 5, skip huge ones)
  let allCss = "";
  // Also grab inline <style> blocks
  const inlineStyleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  while ((m = inlineStyleRe.exec(html))) allCss += m[1] + "\n";

  process.stderr.write(`Found ${cssUrls.length} stylesheet(s). Fetching...\n`);
  for (const cssUrl of cssUrls.slice(0, 6)) {
    try {
      const res = await fetch(cssUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; Systemix/1.0)" },
        signal: AbortSignal.timeout(10_000),
      });
      const text = await res.text();
      if (text.length < 2_000_000) allCss += text + "\n"; // skip >2MB bundles
    } catch { /* skip failed CSS */ }
  }

  process.stderr.write(`Extracted ${allCss.length} bytes of CSS.\n`);

  // 4. Parse
  const customProps  = parseCustomProperties(allCss);
  const tokenMapping = mapToSystemixTokens(customProps);
  const fonts        = extractFonts(allCss);

  // 5. Separate color vs non-color tokens
  const colorTokens: Record<string, string> = {};
  const otherTokens: Record<string, string> = {};
  for (const [k, v] of Object.entries(tokenMapping)) {
    if (isColor(v)) colorTokens[k] = v;
    else otherTokens[k] = v;
  }

  // 6. Also collect ALL custom properties that look like colors (for "extras" section)
  const extraColors: Record<string, string> = {};
  for (const [k, v] of Object.entries(customProps)) {
    if (isColor(v) && !tokenMapping[k]) extraColors[k] = v;
  }

  // 7. Read current globals.css to show diff
  let currentTokens: Record<string, string> = {};
  try {
    const globals = readFileSync(join(ROOT, "src/app/globals.css"), "utf8");
    const lightSection = globals.match(/\.light\s*\{([^}]+)\}/) ??
                        globals.match(/:root\s*\{([^}]+)\}/);
    if (lightSection) {
      const props = parseCustomProperties(`:root {${lightSection[1]}}`);
      currentTokens = props;
    }
  } catch { /* no globals.css */ }

  // 8. Output structured JSON
  const result = {
    source: url,
    scrapedAt: new Date().toISOString(),
    cssBytes: allCss.length,
    customPropertiesFound: Object.keys(customProps).length,
    mappedTokens: {
      colors: colorTokens,
      other: otherTokens,
    },
    fonts,
    extraColors: Object.fromEntries(Object.entries(extraColors).slice(0, 20)),
    currentValues: Object.fromEntries(
      Object.keys(tokenMapping).map(k => [k, currentTokens[k] ?? null])
    ),
    hasMappings: Object.keys(tokenMapping).length > 0,
  };

  console.log(JSON.stringify(result, null, 2));
}

run().catch(e => {
  console.error(JSON.stringify({ error: String(e) }));
  process.exit(1);
});
