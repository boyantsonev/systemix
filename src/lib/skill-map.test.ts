import { describe, expect, it } from "vitest";
import { SKILL_MAP, getSkill, listSkills } from "./skill-map";

describe("SKILL_MAP", () => {
  it("includes the loop runner", () => {
    const loop = getSkill("loop");
    expect(loop).not.toBeNull();
    expect(loop?.command).toBe("node");
    expect(loop?.args).toEqual(["packages/cli/bin/cli.js", "loop"]);
  });

  it("every entry has a label, command, and description", () => {
    for (const [slug, def] of Object.entries(SKILL_MAP)) {
      expect(def.label.length, slug).toBeGreaterThan(0);
      expect(def.command.length, slug).toBeGreaterThan(0);
      expect(def.description.length, slug).toBeGreaterThan(0);
    }
  });

  it("listSkills mirrors the map", () => {
    expect(listSkills().map((s) => s.slug).sort()).toEqual(Object.keys(SKILL_MAP).sort());
  });
});
