# PostHog ↔ Systemix — closing the learning loop (setup runbook)

> Goal: stand up real PostHog (EU) capture + an **automated** loop that turns landing
> engagement into evidence → a HITL decision card → a write-back to a contract. No specific
> experiment to optimize yet — this proves the loop works and can run on a schedule.
> Region decision: **PostHog Cloud EU** (data residency; required for the Connecta K-12 story).

## The loop we're closing
```
Landing (prod) ──fires events──▶ PostHog EU project
        │                              │
        │                     ┌────────┴─────────┐  (scheduled: GitHub Action, daily)
        │                     ▼                  
        │            systemix evidence engagement pull   (landing funnel)
        │            systemix evidence experiment pull    (running experiments)
        │              · HogQL over $pageview / section_viewed / install_command_copied / book_a_call
        │              · → structured evidence written to the contract / experiment
        │              · → honest deterministic synthesis (real numbers, no LLM)
        │              · → HITL card pushed to .systemix/queue.json
        ▼                     │
   /config ◀──────────────────┘   human reviews → approve/reject → write-back + LEARNINGS.md
```
Capture and the query/evidence/write-back become **real**. Synthesis is an honest deterministic
summary of the real numbers (sample-size confidence), so it runs in CI with **no LLM host** —
engine = Claude Code (ADR-019), no Ollama dependency. Claude adds richer reasoning on top when
you run `/hermes`, but the automated path never needs a model.

---

## YOUR PART (~10 min, one-time) — needs a human; Claude can't create accounts or hold keys

### 1. Create the PostHog project (EU)
- Sign up / log in at **https://eu.posthog.com** (the EU cloud — not us.posthog.com).
- Create a project (e.g. "Systemix").

### 2. Collect three values
| Value | Where | Looks like |
|---|---|---|
| **Project API key** (public, for capture) | Project settings → *Project API Key* | `phc_…` |
| **Project ID** (numeric, for queries) | Project settings (or the dashboard URL `/project/<ID>`) | `12345` |
| **Personal API key** (for server queries) | Account → *Personal API keys* → create, scope: read insights/query | `phx_…` |

### 3. Add capture keys to Vercel (Production + Preview)
Dashboard → systemix project → Settings → Environment Variables, **or** CLI:
```
vercel env add NEXT_PUBLIC_POSTHOG_KEY      # paste phc_…   (Production + Preview)
vercel env add NEXT_PUBLIC_POSTHOG_HOST     # https://eu.i.posthog.com
```
Then redeploy (or wait for the next deploy) so the key ships to the browser.
> ⚠️ Until this is set, the live landing captures **nothing** — the console logs
> "PostHog was initialized without a token."

### 4. Add query keys to GitHub Actions secrets (for the scheduled sync)
Repo → Settings → Secrets and variables → Actions → New repository secret:
```
POSTHOG_API_KEY      = phx_…
POSTHOG_PROJECT_ID   = <numeric id>
POSTHOG_HOST         = https://eu.posthog.com
```
(Optional: copy the same three into a local `.env.local` to run `systemix evidence experiment pull`
or `systemix evidence check` by hand.)

Also enable **Settings → Actions → General → Workflow permissions → "Allow GitHub Actions to
create and approve pull requests"** — the scheduled sync (`.github/workflows/systemix-evidence.yml`)
opens a PR with each snapshot.

### 5. Tell Claude when done
Claude verifies end-to-end: confirms events are arriving, runs the engagement pull, and shows
a HITL card landing in `/queue`.

---

## CLAUDE'S PART (code — no keys needed; verified once yours are in)
1. **Config** — `systemix.config.yaml signals.posthog` → EU host + region. `.env.example` with all five vars.
2. **Engagement query** — a landing-engagement read (HogQL over `$pageview`, `section_viewed`,
   `install_command_copied`) producing conversion metrics, written as structured evidence.
   Promotes `spikes/spike-3-posthog/posthog-query.js`. Fixture-backed tests.
3. **Honest synthesis** — summarize the real numbers deterministically (sample-size confidence),
   no LLM host. `/hermes` (Claude) can enrich the card's reasoning on demand; the cron never needs it.
4. **Automation** — `.github/workflows/systemix-evidence.yml`: scheduled (daily) + manual; runs
   both `evidence engagement pull` and `evidence experiment pull` with the GH secrets, writes
   evidence + pushes HITL card(s) as a PR for review.
5. **A/B hook (future-proofing)** — a small `useVariant(flag)` helper that reads a PostHog
   feature flag and tags events with `variant`, so a future A/B test just needs a flag in PostHog —
   no code change to start measuring lift.
6. **Verification** — a `posthog` health check (keys present + connectivity + events arriving).

## Event catalog (already firing from the landing once capture is on)
| Event | Props | Source |
|---|---|---|
| `$pageview` | `$current_url` | `PostHogProvider` |
| `install_command_copied` | `location, variant` | `InstallCommand` |
| `section_viewed` | `section` | `SectionTrack` |
| `experiment_social_signal` | `experiment_id, section, signal_type` | `SectionTrack` (when `experimentId` set) |
| `hero_cta_click` | `cta` | `LandingHero` |
| **`book_a_call`** | `location` | `TrackedLink` (nav / services / about) — **the metric for `landing-live-loop-2026-06`** |
| `brand_clone_request` | `location` | `TrackedLink` (brand-clone CTA) |

The **experiment** pull reads `book_a_call` persons / `$pageview` visitors as the rate; the
**engagement** pull reads the funnel above. Both write to `.systemix/queue.json` for review on
`/config`.

## Verify once your keys are in
```
systemix evidence check                 # keys present + connectivity + $pageviews in 24h
systemix evidence experiment pull       # queues an experiment-validation card from real data
```
Then approve the card on Home (`/config`) — it writes `result`/`decision`/`confidence` back to
`experiments/landing-live-loop-2026-06.mdx` and appends the first cited line to
`experiments/LEARNINGS.md`.
