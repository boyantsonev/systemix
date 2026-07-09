# Pricing & packaging reorg — the €99 download (unbuilt)

## The new ladder (copy shipped this pass)

| Tier | Price | What | Delivery today |
|---|---|---|---|
| Free | €0 | every skill, ghost mode | `npx systemix init` (real) |
| **Full Kit** | **€99** | the whole context engine to download | **mailto → manual** (no checkout, no gate) |
| Readiness Audit | €249 | automated me-in-the-loop audit, 24–48h | mailto → human runs the skill |
| Consultancy | Custom | 2-week discovery + implementation sprint | mailto |

## The gating reality (why €99-as-a-download is a real build)

There is **zero gating today**:
- `packages/cli/package.json` is MIT, `publishConfig.access: public`, `files: [bin, src, pipelines, templates]` — **every skill ships in the public npm tarball.**
- `npx systemix init` vends ~24 skills by plain file-copy; `npx systemix add <x>` pulls the rest. The only "free vs paid" line is which pipelines `init` copies — trivially bypassable.
- No license key, no auth, no entitlement check anywhere (the one "gate" is a UI render-condition on the 3D graph, not payment).
- The Kit "purchase" is a `mailto:`.

So a paid **download** needs a real distribution boundary that doesn't exist yet.

## The reorg (mechanically clean)

Skills are isolated, self-contained directories grouped by pipeline with manifests — easy to split:

1. **Split free vs Kit.** Keep a **free** set (the hypothesis-validation loop skills + `design-audit`) shipping in the public package. Move the **Kit bundle** (the design-system + figma-to-code pipelines + templates + app setup) *out* of the public `files` array into a separate private artifact/repo.
2. **De-dupe** the cross-pipeline duplicates first: `figma`, `tokens`, `drift-report`, `check-parity`, `contract-query`, `sync-to-figma` exist in both `design-system` and `figma-to-code` on disk — collapse to one copy before splitting.
3. **Deliver + charge.** Payment via Gumroad / LemonSqueezy / Stripe; on purchase, deliver a private tarball/zip (or a licensed `npm` scope / a signed download URL). The CLI can optionally validate a key before `add`-ing Kit pipelines — friction, not DRM (skills are inert markdown).

## Interim honesty

Until the boundary + checkout exist: `/kit` copy says "download, pay once", but fulfillment is the existing `kit_requested` mailto — **deliver the artifact by hand**. Don't promise instant automated download in copy.
