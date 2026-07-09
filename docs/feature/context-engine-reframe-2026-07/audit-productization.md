# €249 automated audit — productization (engine exists, delivery unbuilt)

## What already exists

`packages/cli/pipelines/design-system/skills/readiness-audit/SKILL.md` is literally "the paid audit tier's engine." It orchestrates `design-audit` + `drift-report` and adds an ODI-scored readiness rubric:
- overall AI-native readiness score **0–100** + three sub-scores
- 6 dimensions: token discipline, component consistency, codified rules, captured rationale, drift control, agent legibility (`opportunity = importance + max(importance − satisfaction, 0)`)
- a prioritized opportunity list (most underserved first) + the recommended `systemix init` setup path
- output: markdown, or a portable self-contained artifact (same mechanism as `/workflow-artifact`)

## What's missing (the €249 tier)

Today the flow is: `AuditRequestForm` fires `audit_requested` (PostHog) + a `mailto:` → a human opens Claude Code in the prospect's repo and runs `/readiness-audit` → emails the markdown back. There is **no automation, cron, queue-worker, API, or payment**.

To make the €249 tier real:
1. **Payment** — a checkout (Stripe/LemonSqueezy) before or after the form; capture the paid intent, not just the mailto.
2. **Trigger** — on paid request, kick the audit. Options: a queued job that runs the skill against the supplied repo (needs repo access — read-only token or an uploaded snapshot), or a human-in-the-loop task with a 24–48h SLA timer.
3. **Delivery** — render the markdown report as the portable artifact and email it. The "me-in-the-loop" framing (a human reviews before send) is a feature, not a limitation — keep it.
4. **Honesty** — the 24–48h SLA is a human commitment until automated; keep the copy to what a person can keep.

## Payment: LemonSqueezy, before the intake

Gate the audit on a **LemonSqueezy** €249 product (Merchant-of-Record → EU VAT handled). Checkout → success redirect to the intake form (repo/site + email) → a human runs `readiness-audit` → the scored report is emailed in 24–48h. The `AUDIT_CHECKOUT_URL` constant (`src/lib/landing/content.ts`) is the seam — it defaults to the audit mailto today and becomes the LemonSqueezy buy URL once the product exists; `/audit` keeps `AuditRequestForm` as the intake either way.

## Sequencing

The report format, scoring, and rubric are done and deliverable **today** by hand. Ship the copy + form now; add the LemonSqueezy payment first (turns intent into revenue), then the trigger/SLA automation. This is productization of an existing skill, not a new build.
