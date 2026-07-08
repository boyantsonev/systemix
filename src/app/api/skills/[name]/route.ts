import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Resolve a skill's SKILL.md body for the /config graph's "copy skill" action.
// Order: the instance-installed copy (.claude/skills/<name>) first, then the
// bundled pipeline sources (packages/cli/pipelines/*/skills/<name>) — so it works
// both in a real instance and in this repo (which vendors the skills as source).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    return NextResponse.json({ error: "invalid skill name" }, { status: 400 });
  }

  const root = process.cwd();
  const candidates = [path.join(root, ".claude", "skills", name, "SKILL.md")];

  const pipelinesDir = path.join(root, "packages", "cli", "pipelines");
  if (fs.existsSync(pipelinesDir)) {
    for (const pipeline of fs.readdirSync(pipelinesDir)) {
      candidates.push(path.join(pipelinesDir, pipeline, "skills", name, "SKILL.md"));
    }
  }

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      const body = fs.readFileSync(file, "utf8");
      return NextResponse.json({ name, path: path.relative(root, file), body });
    }
  }

  return NextResponse.json({ error: "skill not found" }, { status: 404 });
}
