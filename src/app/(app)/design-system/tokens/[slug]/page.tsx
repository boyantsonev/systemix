import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { parse as parseColor, formatHex, differenceCiede2000 } from "culori";
import { TokenResolveControl } from "@/components/contract/TokenResolveControl";

const TOKEN_DIR = join(process.cwd(), "contract", "tokens");
const COMP_DIR  = join(process.cwd(), "contract", "components");

/** Scan all component contracts → find which ones reference a given CSS variable. */
function findComponentsUsingToken(tokenSlug: string): { name: string; slug: string; parity: string }[] {
  const cssVar = `--${tokenSlug}`;
  const results: { name: string; slug: string; parity: string }[] = [];
  try {
    for (const entry of readdirSync(COMP_DIR)) {
      if (!entry.endsWith(".mdx")) continue;
      const { data: fm } = matter(readFileSync(join(COMP_DIR, entry), "utf8"));
      if (!fm.component) continue;
      const componentSlug = entry.replace(".mdx", "");
      let found = false;

      // 1. Check component source file for var(--token) references
      if (fm.path) {
        const srcPath = join(process.cwd(), fm.path as string);
        if (existsSync(srcPath)) {
          const src = readFileSync(srcPath, "utf8");
          if (src.includes(cssVar)) found = true;
        }
      }

      // 2. Fallback: check the MDX prose for mentions of the token name
      if (!found) {
        const raw = readFileSync(join(COMP_DIR, entry), "utf8");
        if (raw.includes(cssVar)) found = true;
      }

      if (found) {
        results.push({ name: fm.component as string, slug: componentSlug, parity: (fm.parity as string) ?? "unknown" });
      }
    }
  } catch {}
  return results;
}

type Fm = {
  token?:              string;
  value?:              string;
  "figma-value"?:      string | null;
  status?:             string;
  resolved?:           boolean;
  collection?:         string;
  source?:             string;
  "delta-e"?:          number | null;
  "last-updated"?:     string;
  "last-resolver"?:    string | null;
  "resolve-decision"?: string | null;
};

export async function generateStaticParams() {
  const slugs: { slug: string }[] = [];
  try {
    for (const entry of readdirSync(TOKEN_DIR)) {
      if (entry.endsWith(".mdx")) slugs.push({ slug: entry.replace(".mdx", "") });
    }
  } catch {}
  return slugs;
}

function computeDeltaE(a: string, b: string): number | null {
  try {
    const ca = parseColor(a);
    const cb = parseColor(b);
    if (!ca || !cb) return null;
    return Math.round(differenceCiede2000()(ca, cb) * 10) / 10;
  } catch { return null; }
}

function toHex(v: string): string | null {
  try { return formatHex(parseColor(v)!) ?? null; } catch { return null; }
}

function isColor(v?: string | null): boolean {
  if (!v) return false;
  return /^(#|oklch\(|oklab\(|rgb[a]?\(|hsl[a]?\()/i.test(v.trim());
}

function deltaEBand(de: number) {
  if (de < 2) return { label: "imperceptible",    colour: "text-green-400",  bar: "bg-green-500" };
  if (de < 5) return { label: "just perceptible", colour: "text-yellow-400", bar: "bg-yellow-500" };
  return             { label: "obvious drift",    colour: "text-red-400",    bar: "bg-red-500" };
}

function StatusPill({ status }: { status: string }) {
  const cls: Record<string, string> = {
    clean:              "bg-green-500/15 text-green-400 border-green-500/30",
    drifted:            "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    "missing-in-figma": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-mono font-medium ${cls[status] ?? "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}

export default async function TokenDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath  = join(TOKEN_DIR, `${slug}.mdx`);

  let raw: string;
  try { raw = readFileSync(filePath, "utf8"); } catch { notFound(); return; }

  const { data: fm, content } = matter(raw) as { data: Fm; content: string };
  if (!fm.token) notFound();

  const name        = fm.token!;
  const status      = fm.status ?? "unknown";
  const showResolve = status === "drifted" && fm.resolved === false;
  const isColorTok  = isColor(fm.value);
  const hasFigma    = fm["figma-value"] != null && fm["figma-value"] !== "null";
  const de          = isColorTok && hasFigma ? computeDeltaE(fm.value!, fm["figma-value"]!) : null;
  const codeHex     = isColorTok ? toHex(fm.value!) : null;
  const hasContent  = content.trim().length > 0;

  const usedBy = findComponentsUsingToken(slug);

  return (
    <article>
      {/* Breadcrumb */}
      <p className="text-[13px] font-mono text-muted-foreground mb-3">
        <Link href="/design-system" className="hover:text-foreground transition-colors">
          Design System
        </Link>
        {fm.collection && (
          <span className="text-muted-foreground/40"> · {fm.collection}</span>
        )}
      </p>

      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap mb-8">
        <h1 className="text-[2rem] font-black tracking-tight leading-[1.15] font-mono">{name}</h1>
        <StatusPill status={status} />
        {fm.resolved && fm["resolve-decision"] && (
          <span className="text-[10px] font-mono text-muted-foreground/50 border border-border/30 px-2 py-0.5 rounded">
            {fm["resolve-decision"]}
          </span>
        )}
      </div>

      {/* Color swatches */}
      {isColorTok && (
        <div className="mb-8">
          <div className={`flex gap-4 ${hasFigma ? "" : "max-w-xs"}`}>
            <div className="flex-1">
              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-2">Code</p>
              <div className="h-16 rounded-xl border border-white/10 mb-2" style={{ backgroundColor: fm.value }} />
              <p className="text-[11px] font-mono text-muted-foreground">{fm.value}</p>
              {codeHex && codeHex !== fm.value && (
                <p className="text-[10px] font-mono text-muted-foreground/50">{codeHex}</p>
              )}
            </div>
            {hasFigma && (
              <div className="flex-1">
                <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-2">Figma</p>
                <div className="h-16 rounded-xl border border-white/10 mb-2" style={{ backgroundColor: fm["figma-value"]! }} />
                <p className="text-[11px] font-mono text-muted-foreground">{fm["figma-value"]}</p>
              </div>
            )}
          </div>
          {de !== null && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-[11px] font-mono text-muted-foreground/60">ΔE (CIEDE2000)</span>
              <span className="text-[13px] font-mono font-medium text-foreground">{de}</span>
              <span className={`text-[11px] font-mono ${deltaEBand(de).colour}`}>
                — {deltaEBand(de).label}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden max-w-32">
                <div
                  className={`h-full rounded-full ${deltaEBand(de).bar}`}
                  style={{ width: `${Math.min(100, (de / 10) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Drift triage — immediately after evidence, before prose */}
      {showResolve && (
        <div className="rounded-xl border border-yellow-500/25 bg-yellow-500/5 px-4 py-4 mb-8">
          <p className="text-[11px] font-mono text-yellow-400/80 uppercase tracking-widest mb-3">
            Unresolved drift — decision required
          </p>
          <TokenResolveControl slug={slug} />
        </div>
      )}

      <hr className="border-border/40 mb-8" />

      {/* Prose body */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest">Documentation</p>
        <a
          href={`vscode://file/${filePath}`}
          className="text-[11px] font-mono text-muted-foreground/40 hover:text-muted-foreground border border-border/30 px-2 py-0.5 rounded hover:border-border/60 transition-colors"
        >
          Edit in editor
        </a>
      </div>

      {hasContent ? (
        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed mb-10 [&_code]:text-foreground/80 [&_code]:bg-muted/60 [&_code]:px-1 [&_code]:rounded [&_code]:text-[12px]">
          <MDXRemote source={content} />
        </div>
      ) : (
        <p className="font-mono text-[13px] text-muted-foreground/40 mb-10">
          No documentation yet. Run{" "}
          <code className="text-muted-foreground/60">/tokens</code>{" "}
          in Claude Code or Cursor to have Hermes write this page.
        </p>
      )}

      {/* Metadata */}
      <div className="rounded-xl border border-border/40 bg-muted/10 px-4 py-2 mb-8 divide-y divide-border/20">
        {!isColorTok && fm.value && (
          <div className="flex gap-3 py-2">
            <span className="text-[11px] font-mono text-muted-foreground/60 w-32 shrink-0">value</span>
            <span className="text-[12px] font-mono text-foreground break-all">{fm.value}</span>
          </div>
        )}
        {!isColorTok && fm["figma-value"] != null && (
          <div className="flex gap-3 py-2">
            <span className="text-[11px] font-mono text-muted-foreground/60 w-32 shrink-0">figma-value</span>
            <span className="text-[12px] font-mono text-foreground">{fm["figma-value"]}</span>
          </div>
        )}
        {fm.collection && (
          <div className="flex gap-3 py-2">
            <span className="text-[11px] font-mono text-muted-foreground/60 w-32 shrink-0">collection</span>
            <span className="text-[12px] font-mono text-foreground">{fm.collection}</span>
          </div>
        )}
        {fm.source && (
          <div className="flex gap-3 py-2">
            <span className="text-[11px] font-mono text-muted-foreground/60 w-32 shrink-0">source</span>
            <span className="text-[12px] font-mono text-foreground">{fm.source}</span>
          </div>
        )}
        {"resolved" in fm && (
          <div className="flex gap-3 py-2">
            <span className="text-[11px] font-mono text-muted-foreground/60 w-32 shrink-0">resolved</span>
            <span className="text-[12px] font-mono text-foreground">{String(fm.resolved)}</span>
          </div>
        )}
        {fm["resolve-decision"] && (
          <div className="flex gap-3 py-2">
            <span className="text-[11px] font-mono text-muted-foreground/60 w-32 shrink-0">decision</span>
            <span className="text-[12px] font-mono text-foreground">{fm["resolve-decision"]}</span>
          </div>
        )}
        {fm["last-updated"] && (
          <div className="flex gap-3 py-2">
            <span className="text-[11px] font-mono text-muted-foreground/60 w-32 shrink-0">last-updated</span>
            <span className="text-[12px] font-mono text-foreground">{String(fm["last-updated"]).slice(0, 10)}</span>
          </div>
        )}
      </div>

      {/* Used by — reverse index */}
      <div className="rounded-xl border border-border/40 px-4 py-4">
        <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-3">Used by</p>
        {usedBy.length === 0 ? (
          <p className="text-[13px] text-muted-foreground/40">No components reference this token directly.</p>
        ) : (
          <div className="space-y-1">
            {usedBy.map(({ name, slug: cSlug, parity }) => (
              <Link
                key={cSlug}
                href={`/design-system/components/${cSlug}`}
                className="flex items-center gap-3 px-2 py-1.5 -mx-2 rounded-md hover:bg-muted/30 transition-colors group"
              >
                <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${parity === "clean" ? "bg-green-500" : parity === "drifted" ? "bg-yellow-500" : "bg-muted-foreground/30"}`} />
                <span className="text-[13px] font-medium text-foreground group-hover:text-foreground/80">{name}</span>
                <span className="text-[10px] font-mono text-muted-foreground/40 ml-auto">{parity}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
