import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const QUEUE_PATH = path.join(process.cwd(), ".systemix", "queue.json");

const DEMO_CARDS = [
  // ── Hypothesis validation (systemix-landing UAT) ──────────────────────────
  {
    id: "demo-hyp-1",
    type: "hypothesis-validation",
    project: "systemix-landing",
    hypothesis: "Hero framing: 'Memory Layer' vs 'Evidence Layer'",
    metric: "CTA click rate",
    baselineRate: 0.032,
    variantRate: 0.047,
    confidenceLevel: 0.87,
    sessions: 1240,
    proposal: "Promote variant B: update hero tagline to 'The Evidence Layer for design systems'. Reframe the page around production evidence written back into the contract. Update contract rationale.",
    context: "Hermes synthesis — 'Memory Layer' overlaps with Knapsack's 'Living System of Record' (a competing enterprise category). 'Evidence Layer' names the uncontested wedge: production results written back into the component contract. Variant B outperforms across all scroll depths; confidence high.",
    requestedAt: "2026-04-27T08:00:00.000Z",
    status: "pending",
  },
  // ── Standard drift / instrumentation cards ────────────────────────────────
  {
    id: "demo-1",
    type: "drift-resolution",
    project: "finova",
    token: "color.primary.500",
    filePath: "contract/tokens/color-primary-500.mdx",
    proposed: "code-wins",
    context: "Code #0063c4 vs Figma #0052a3 — ΔE 7.2, Tier 3 (obvious). Code reflects the Q1 brand refresh.",
    requestedAt: "2026-04-27T07:30:00.000Z",
    confidence: 0.91,
    status: "pending",
  },
  {
    id: "demo-2",
    type: "instrumentation-approval",
    project: "systemix-landing",
    component: "Button",
    filePath: "src/components/ui/button.tsx",
    proposed: "posthog.capture('button_click', { variant, size, label })",
    context: "Hermes wants to add PostHog instrumentation to capture Button interaction events.",
    requestedAt: "2026-04-27T07:00:00.000Z",
    confidence: 0.84,
    status: "pending",
  },
  {
    id: "demo-3",
    type: "new-token",
    project: "finova",
    token: "color.accent.violet",
    filePath: "contract/tokens/color-accent-violet.mdx",
    proposed: "Add to Figma variable library as Semantic/color.accent.violet",
    context: "Token #7c3aed exists in globals.css but has no Figma counterpart. Missing-in-Figma.",
    requestedAt: "2026-04-26T18:00:00.000Z",
    confidence: 0.88,
    status: "pending",
  },
];

function readQueue() {
  if (!fs.existsSync(QUEUE_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
  } catch {
    return null;
  }
}

function writeQueue(data: unknown) {
  const dir = path.dirname(QUEUE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = QUEUE_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, QUEUE_PATH);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectSlug = searchParams.get("project") ?? null;

  const queue = readQueue();
  if (!queue) {
    const cards = projectSlug
      ? DEMO_CARDS.filter(c => !("project" in c) || c.project === projectSlug)
      : DEMO_CARDS;
    return NextResponse.json({
      cards,
      pendingCount: cards.filter(c => c.status === "pending").length,
      isDemo: true,
    });
  }
  const cards = (queue.cards ?? []).filter(
    (c: { project?: string }) => !projectSlug || !c.project || c.project === projectSlug
  );
  const pendingCount = cards.filter((c: { status: string }) => c.status === "pending").length;
  return NextResponse.json({ cards, pendingCount, isDemo: false });
}

export async function PATCH(req: NextRequest) {
  const { id, action, note } = await req.json();
  if (!id || !action) {
    return NextResponse.json({ error: "id and action required" }, { status: 400 });
  }
  const queue = readQueue() ?? { cards: [] };
  const card = (queue.cards as Array<{ id: string; status: string; resolvedAt?: string; resolution?: unknown }>)
    .find(c => c.id === id);
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }
  card.status = action;
  card.resolvedAt = new Date().toISOString();
  card.resolution = { action, note: note ?? null, resolvedBy: "dashboard" };
  writeQueue(queue);
  return NextResponse.json({ id, action, card });
}
