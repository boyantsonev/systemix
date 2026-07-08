import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// The skills & workflows catalog — enumerates the CLI packs (workflows) under
// packages/cli/pipelines/*/manifest.json with each skill's SKILL.md
// description, plus the skills installed in this repo's .claude/skills/.
// Server-only (fs). Consumed by /skills and the shell sidebar tree.

export type CatalogSkill = {
  slug: string;
  description: string;
};

export type CatalogPack = {
  name: string;
  displayName: string;
  description: string;
  startWith?: string;
  version?: string;
  skills: CatalogSkill[];
};

function skillDescription(packDir: string, slug: string): string {
  try {
    const raw = fs.readFileSync(path.join(packDir, "skills", slug, "SKILL.md"), "utf8");
    const fm = matter(raw).data as { description?: string };
    // Keep the card readable — first sentence of the (often long) description.
    const d = fm.description ?? "";
    const first = d.split(/(?<=\.)\s/)[0] ?? d;
    return first.trim();
  } catch {
    return "";
  }
}

/** All CLI packs (the workflows), each with its skill roster. */
export function loadSkillPacks(): CatalogPack[] {
  const pipelinesDir = path.join(process.cwd(), "packages", "cli", "pipelines");
  try {
    return fs
      .readdirSync(pipelinesDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e): CatalogPack | null => {
        const packDir = path.join(pipelinesDir, e.name);
        try {
          const manifest = JSON.parse(
            fs.readFileSync(path.join(packDir, "manifest.json"), "utf8"),
          ) as {
            name: string;
            displayName?: string;
            description?: string;
            startWith?: string;
            version?: string;
            skills?: string[];
          };
          return {
            name: manifest.name,
            displayName: manifest.displayName ?? manifest.name,
            description: manifest.description ?? "",
            startWith: manifest.startWith,
            version: manifest.version,
            skills: (manifest.skills ?? []).map((slug) => ({
              slug,
              description: skillDescription(packDir, slug),
            })),
          } satisfies CatalogPack;
        } catch {
          return null;
        }
      })
      .filter((p): p is CatalogPack => p !== null);
  } catch {
    return [];
  }
}

/** Skills installed in THIS repo's .claude/skills/ (dirs with SKILL.md or bare .md files). */
export function loadInstalledSkills(): CatalogSkill[] {
  const dir = path.join(process.cwd(), ".claude", "skills");
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .map((e) => {
        try {
          const file = e.isDirectory()
            ? path.join(dir, e.name, "SKILL.md")
            : e.name.endsWith(".md")
              ? path.join(dir, e.name)
              : null;
          if (!file || !fs.existsSync(file)) return null;
          const fm = matter(fs.readFileSync(file, "utf8")).data as {
            name?: string;
            description?: string;
          };
          const d = fm.description ?? "";
          return {
            slug: fm.name ?? e.name.replace(/\.md$/, ""),
            description: (d.split(/(?<=\.)\s/)[0] ?? d).trim(),
          } satisfies CatalogSkill;
        } catch {
          return null;
        }
      })
      .filter((s): s is CatalogSkill => s !== null);
  } catch {
    return [];
  }
}
