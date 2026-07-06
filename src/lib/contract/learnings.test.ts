import { describe, expect, it } from "vitest";
import { renderMemoryLine, type MemoryEntry } from "./memory-mdx";
import { parseLearnings } from "./learnings";

const LEDGER_HEADER = `# Learnings

The earned memory of this instance.

## Memory

Every entry cites the experiment that earned it.

`;

function ledgerWith(entries: MemoryEntry[]): string {
  return LEDGER_HEADER + entries.map(renderMemoryLine).join("\n") + "\n";
}

describe("parseLearnings ↔ renderMemoryLine round-trip", () => {
  it("round-trips a full entry written by the canonical writer", () => {
    const entry: MemoryEntry = {
      date: "2026-07-06",
      title: "Live loop converts founders",
      experimentId: "landing-ai-native-ds-2026-07",
      decision: "promote",
      confidence: 0.85,
      summary: "Seeing the dogfooded loop lifts book-a-call.",
      reviewBy: "2026-10-06",
    };
    const parsed = parseLearnings(ledgerWith([entry]));
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({
      date: "2026-07-06",
      title: "Live loop converts founders",
      confidence: 0.85,
      experimentId: "landing-ai-native-ds-2026-07",
      decision: "promote",
      reviewBy: "2026-10-06",
      usedBy: [],
    });
  });

  it("parses a null confidence (rendered as —) back to null", () => {
    const entry: MemoryEntry = {
      date: "2026-07-06",
      title: "No-confidence learning",
      experimentId: "exp-x",
      decision: "kill",
      confidence: null,
      summary: "",
      reviewBy: "2026-08-06",
    };
    const [parsed] = parseLearnings(ledgerWith([entry]));
    expect(parsed.confidence).toBeNull();
    expect(parsed.decision).toBe("kill");
  });

  it("keeps file order (newest-first) across multiple entries", () => {
    const mk = (date: string, id: string): MemoryEntry => ({
      date,
      title: `Learning ${id}`,
      experimentId: id,
      decision: "iterate",
      confidence: 0.6,
      summary: "s.",
      reviewBy: "2026-09-01",
    });
    const parsed = parseLearnings(ledgerWith([mk("2026-07-06", "b"), mk("2026-07-01", "a")]));
    expect(parsed.map((e) => e.experimentId)).toEqual(["b", "a"]);
  });

  it("parses Used by backlinks into ids", () => {
    const line =
      "- **2026-07-06 · Cited learning** — confidence 0.7 · from [exp-1], decision: promote. Review by: 2026-09-01. Used by: [exp-2], [exp-3]";
    const [parsed] = parseLearnings(`## Memory\n\n${line}\n`);
    expect(parsed.usedBy).toEqual(["exp-2", "exp-3"]);
  });

  it("returns [] for an empty or placeholder-only ledger", () => {
    expect(parseLearnings("")).toEqual([]);
    expect(parseLearnings("## Memory\n\n*No entries yet.*\n")).toEqual([]);
  });
});
