import { describe, expect, it } from "vitest";
import { MCP_TOOL_NAMES, PERSONAS, personaContent } from "./personas";

const SECTION_KEYS = ["loop", "doors", "trust", "services", "brandClone"];

describe("persona registry", () => {
  it("has an entry for every persona key", () => {
    for (const key of PERSONAS) {
      expect(personaContent[key]).toBeDefined();
      expect(personaContent[key].key).toBe(key);
    }
  });

  it("caps each persona at exactly 3 JTBD cards with non-empty copy", () => {
    for (const key of PERSONAS) {
      const { jtbd } = personaContent[key];
      expect(jtbd.items).toHaveLength(3);
      for (const item of jtbd.items) {
        expect(item.title.length).toBeGreaterThan(0);
        expect(item.body.length).toBeGreaterThan(0);
      }
    }
  });

  it("has complete hero + meta copy per persona", () => {
    for (const key of PERSONAS) {
      const p = personaContent[key];
      expect(p.hero.eyebrow.length).toBeGreaterThan(0);
      expect(p.hero.heading.length).toBeGreaterThan(0);
      expect(p.hero.body.length).toBeGreaterThan(0);
      expect(p.hero.primaryCta.href.length).toBeGreaterThan(0);
      expect(p.metaTitle.length).toBeGreaterThan(0);
      expect(p.metaDescription.length).toBeGreaterThan(0);
    }
  });

  it("only composes known shared sections", () => {
    for (const key of PERSONAS) {
      for (const section of personaContent[key].sharedSections) {
        expect(SECTION_KEYS).toContain(section);
      }
    }
  });

  it("points every guideHref at /docs/guides/<persona>", () => {
    for (const key of PERSONAS) {
      expect(personaContent[key].guideHref).toBe(`/docs/guides/${key}`);
    }
  });

  it("exposes a non-empty, unique MCP tool list for the agents page", () => {
    expect(MCP_TOOL_NAMES.length).toBeGreaterThan(0);
    expect(new Set(MCP_TOOL_NAMES).size).toBe(MCP_TOOL_NAMES.length);
  });
});
