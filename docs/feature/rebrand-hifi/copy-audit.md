# copy-audit.md — Audit request page (`/audit`)

> **Superseded.** The audit shipped as a paid, human-reviewed AI-Readiness
> Audit (€249, emailed in 24–48h) — not the free/instant magnet described
> below. Treat `src/app/audit/page.tsx` as the source of truth, not this file.

> getdesign.md/request clone: a lead magnet. Dark, focused, one job — get the 3-field form filled. Free audit as the hook; cross-sell the Kit.

---

## 1. Hero
- Eyebrow: `Free · takes 10 minutes`
- H1: **Find out where your design system is rotting.**
- Sub: Send us your repo. We run the loop once and show you the drift — free.
- CTA: **Get my free audit** (scrolls to form) → `audit_requested`

---

## 2. Two cards  *(choose your path)*

**Card A — Free Audit**
- **$0** — one pass of the loop on your repo.
- You get: a drift report + top 3 decisions we'd propose.
- CTA: **Start free audit**

**Card B — AI Kit**  *(cross-promo)*
- ~~$299~~ **$249** pay once — skip the wait, run the loop yourself.
- CTA: **Get the Kit** → `cross_promo_click`

---

## 3. The form  *(existing 3-field `AuditRequestForm` — keep fields)*

- **Repo or site URL**
- **Email**
- **Your stack** (e.g. Next.js + shadcn + Tailwind)
- Button: **Send it →** → `audit_requested` (props: `location`, `persona`)
- Microcopy under button: *No spam. We reply with the report, not a sales call.*

---

## 4. Founders strip
**Built by a two-person studio.** We run this loop on our own site every week. You'll get a human reading your report — not a bot.

---

## 5. Proof wall  *(placeholder)*
⚠️ Grid of short outcomes / quotes once you have them. Until then, use one honest line:
**"Systemix's own site is the first case study — every headline here was chosen by the loop."**

---

### PostHog seams
`audit_requested`, `cross_promo_click`, `brand_clone_request`, `section_viewed`. Props: `location / persona / stack`.
