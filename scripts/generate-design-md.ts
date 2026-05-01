/**
 * generate-design-md.ts  — SYSTMIX-265
 *
 * Reads contract/tokens/*.mdx and contract/components/*.mdx and emits DESIGN.md
 * (Google Labs format, Apache 2.0) in the project root.
 *
 * Mapping follows docs/design-md-mapping.md:
 *   - Token values → colors / rounded / spacing sections (native DESIGN.md)
 *   - Component definitions → components section (native DESIGN.md)
 *   - Systemix-specific metadata → x-systemix extension block (tolerated by spec)
 *   - Hermes production evidence → ## Production Evidence H2 (preserved by spec)
 *
 * Usage:
 *   npm run design-md
 *   npm run design-md -- --dry-run
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { parse as parseColor, formatHex } from "culori";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ROOT       = join(__dirname, "..");
const TOKEN_DIR  = join(ROOT, "contract/tokens");
const COMP_DIR   = join(ROOT, "contract/components");
const OUT_PATH   = join(ROOT, "DESIGN.md");

const DRY_RUN = process.argv.includes("--dry-run");

// ── Helpers ──────────────────────────────────────────────────────────────────

function toHex(value: string): string | null {
  if (!value) return null;
  try {
    const c = parseColor(value);
    if (!c) return null;
    return formatHex(c) ?? null;
  } catch {
    return null;
  }
}

function isColor(value: string): boolean {
  return value.startsWith("#") || value.startsWith("oklch") ||
    value.startsWith("rgb") || value.startsWith("hsl") || value.startsWith("color(");
}

function yamlStr(value: string): string {
  return value.includes(":") || value.includes("#") ? `"${value}"` : value;
}

function indent(s: string, n: number): string {
  const pad = " ".repeat(n);
  return s.split("\n").map(l => l ? pad + l : l).join("\n");
}

// ── Read contracts ────────────────────────────────────────────────────────────

interface TokenData {
  slug: string;
  token: string;
  value: string;
  figmaValue: string | null;
  status: string;
  collection: string;
  evidencePosthog: string | null;
  prose: string;
}

interface ComponentData {
  slug: string;
  component: string;
  parity: string;
  figmaNode: string | null;
  storybookDrift: boolean;
  evidencePosthog: string | null;
  prose: string;
}

function readTokens(): TokenData[] {
  if (!existsSync(TOKEN_DIR)) return [];
  return readdirSync(TOKEN_DIR)
    .filter(f => f.endsWith(".mdx"))
    .map(f => {
      const raw = readFileSync(join(TOKEN_DIR, f), "utf8");
      const { data: fm, content } = matter(raw);
      const slug = f.replace(/\.mdx$/, "");
      return {
        slug,
        token:         String(fm.token ?? slug),
        value:         String(fm.value ?? ""),
        figmaValue:    fm["figma-value"] ? String(fm["figma-value"]) : null,
        status:        String(fm.status ?? "unknown"),
        collection:    String(fm.collection ?? ""),
        evidencePosthog: fm["evidence-posthog"] ? JSON.stringify(fm["evidence-posthog"]) : null,
        prose: content.trim(),
      };
    });
}

function readComponents(): ComponentData[] {
  if (!existsSync(COMP_DIR)) return [];
  return readdirSync(COMP_DIR)
    .filter(f => f.endsWith(".mdx"))
    .map(f => {
      const raw = readFileSync(join(COMP_DIR, f), "utf8");
      const { data: fm, content } = matter(raw);
      const slug = f.replace(/\.mdx$/, "");
      return {
        slug,
        component:       String(fm.component ?? slug),
        parity:          String(fm.parity ?? "unknown"),
        figmaNode:       fm["figma-node"] ? String(fm["figma-node"]) : null,
        storybookDrift:  fm["storybook-drift"] === true,
        evidencePosthog: fm["evidence-posthog"] ? JSON.stringify(fm["evidence-posthog"]) : null,
        prose: content.trim(),
      };
    });
}

// ── Build DESIGN.md sections ──────────────────────────────────────────────────

function buildFrontmatter(tokens: TokenData[], components: ComponentData[]): string {
  const lines: string[] = ["---", "version: alpha", "name: Systemix", `description: "Design system evidence layer — tokens, components, and production results."`];

  // Colors
  const colors = tokens.filter(t => t.value && isColor(t.value));
  if (colors.length > 0) {
    lines.push("colors:");
    for (const t of colors) {
      const hex = toHex(t.value) ?? t.value;
      lines.push(`  ${t.slug}: ${yamlStr(hex)}`);
    }
  }

  // Rounded (radius tokens)
  const rounded = tokens.filter(t => t.slug.includes("radius") && t.value && !isColor(t.value));
  if (rounded.length > 0) {
    lines.push("rounded:");
    for (const t of rounded) {
      lines.push(`  ${t.slug.replace(/^radius[-_]?/, "") || t.slug}: ${yamlStr(t.value)}`);
    }
  }

  // Spacing
  const spacing = tokens.filter(t => t.slug.includes("spacing") && t.value && !isColor(t.value));
  if (spacing.length > 0) {
    lines.push("spacing:");
    for (const t of spacing) {
      lines.push(`  ${t.slug.replace(/^spacing[-_]?/, "") || t.slug}: ${yamlStr(t.value)}`);
    }
  }

  // Components (DESIGN.md property whitelist: backgroundColor, textColor, typography, rounded, padding, size, height, width)
  if (components.length > 0) {
    lines.push("components:");
    for (const c of components) {
      const key = c.component.toLowerCase().replace(/\s+/g, "-");
      lines.push(`  ${key}:`);
      lines.push(`    parity: ${c.parity}`);
    }
  }

  // x-systemix extension block
  lines.push("x-systemix:");
  lines.push("  schema: spike-2");
  lines.push("  generated: " + new Date().toISOString().slice(0, 10));
  lines.push(`  tokens-count: ${tokens.length}`);
  lines.push(`  components-count: ${components.length}`);
  const driftedT = tokens.filter(t => t.status === "drifted").length;
  const driftedC = components.filter(c => c.parity === "drifted").length;
  lines.push(`  drifted-tokens: ${driftedT}`);
  lines.push(`  drifted-components: ${driftedC}`);

  lines.push("---");
  return lines.join("\n");
}

function buildBody(tokens: TokenData[], components: ComponentData[]): string {
  const sections: string[] = [];

  // Overview
  sections.push("## Overview\n\nSystemix is the evidence layer for design systems. Every token and component carries its production evidence — PostHog results, Figma parity status, and the Hermes rationale that justified each decision. The contract is machine-readable by any DESIGN.md-aware tool and human-readable for agents, reviews, and audits.\n");

  // Colors
  const colors = tokens.filter(t => t.value && isColor(t.value));
  if (colors.length > 0) {
    const rows = colors.map(t => {
      const hex = toHex(t.value) ?? t.value;
      const drift = t.figmaValue && t.figmaValue !== t.value ? ` (Figma: ${t.figmaValue}, status: ${t.status})` : "";
      return `- \`--${t.token}\`: ${hex}${drift}`;
    }).join("\n");
    sections.push(`## Colors\n\n${rows}\n`);
  }

  // Components
  if (components.length > 0) {
    const rows = components.map(c =>
      `- **${c.component}** — parity: \`${c.parity}\`${c.storybookDrift ? " · storybook drift" : ""}${c.figmaNode ? ` · figma: \`${c.figmaNode}\`` : ""}`
    ).join("\n");
    sections.push(`## Components\n\n${rows}\n`);
  }

  // Production Evidence — preserved by spec as an unknown H2 section
  const evidenceLines: string[] = [];
  for (const c of components) {
    if (c.prose) {
      evidenceLines.push(`### ${c.component}\n\n${c.prose}\n`);
    }
  }
  for (const t of tokens) {
    if (t.prose && t.status === "drifted") {
      evidenceLines.push(`### Token: ${t.token}\n\n${t.prose}\n`);
    }
  }
  if (evidenceLines.length > 0) {
    sections.push(`## Production Evidence\n\n_Written by Hermes from PostHog events and contract history. This section is preserved by the DESIGN.md spec as an unknown heading._\n\n${evidenceLines.join("\n")}`);
  }

  return sections.join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────

const tokens     = readTokens();
const components = readComponents();

const frontmatter = buildFrontmatter(tokens, components);
const body        = buildBody(tokens, components);
const output      = `${frontmatter}\n\n${body}`;

if (DRY_RUN) {
  console.log("[design-md] dry-run — output:\n");
  console.log(output.slice(0, 800) + (output.length > 800 ? "\n...(truncated)" : ""));
} else {
  writeFileSync(OUT_PATH, output, "utf8");
  console.log(`[design-md] wrote ${OUT_PATH} (${tokens.length} tokens, ${components.length} components)`);
}
