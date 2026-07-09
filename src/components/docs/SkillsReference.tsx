// The generated skills reference — reads the loop skills' SKILL.md frontmatter
// at build time so the docs can never drift from the shipped skills (the old
// hardcoded table said "Six skills" while listing seven). Docs pages are
// statically generated, so the fs reads happen on the build machine, where
// packages/cli/ exists — same files the /api/skills/[name] route serves.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SKILLS_DIR = path.join(
  process.cwd(),
  "packages/cli/pipelines/hypothesis-validation/skills",
);

type SkillRow = { name: string; description: string };

function readSkills(): SkillRow[] {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const file = path.join(SKILLS_DIR, d.name, "SKILL.md");
      if (!fs.existsSync(file)) return null;
      const raw = fs.readFileSync(file, "utf8");
      try {
        const { data } = matter(raw);
        return {
          name: String(data.name ?? d.name),
          description: String(data.description ?? ""),
        };
      } catch {
        // A skill with malformed YAML shouldn't take the docs build down —
        // fall back to a line-level read of the description.
        const desc = raw.match(/^description:\s*(.+)$/m)?.[1] ?? "";
        return { name: d.name, description: desc.trim() };
      }
    })
    .filter((s): s is SkillRow => s !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function SkillsReference() {
  const skills = readSkills();
  return (
    <>
      <p>
        <strong>{skills.length} Claude Code skills</strong> ship with the loop. This table is
        generated from the skills themselves at build time — it can&apos;t drift.
      </p>
      <table>
        <thead>
          <tr>
            <th>Skill</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((s) => (
            <tr key={s.name}>
              <td>
                <code>/{s.name}</code>
              </td>
              <td>{s.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
