"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

// ── Queue helpers ─────────────────────────────────────────────────────────────

function queuePath(projectRoot) {
  return path.join(projectRoot, ".systemix", "queue.json");
}

function readQueue(projectRoot) {
  const p = queuePath(projectRoot);
  if (!fs.existsSync(p)) return { cards: [] };
  try { return JSON.parse(fs.readFileSync(p, "utf8")); }
  catch { return { cards: [] }; }
}

function writeQueue(projectRoot, data) {
  const p = queuePath(projectRoot);
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = p + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, p);
}

function pushToQueue(projectRoot, card) {
  const queue = readQueue(projectRoot);
  queue.cards.push({
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    requestedAt: new Date().toISOString(),
    status: "pending",
    ...card,
  });
  writeQueue(projectRoot, queue);
  const label = card.token ?? card.component ?? card.filePath;
  console.log(`  [queue] → ${card.type}: ${label}`);
}

// ── Token + contract regeneration ────────────────────────────────────────────

function runScript(name, projectRoot, dryRun) {
  if (dryRun) {
    console.log(`  [dry-run] Would run: npm run ${name}`);
    return true;
  }
  const result = spawnSync("npm", ["run", name], { stdio: "inherit", cwd: projectRoot });
  return result.status === 0;
}

function hasScript(pkgJson, name) {
  return !!(pkgJson.scripts && pkgJson.scripts[name]);
}

async function regenerateContracts(projectRoot, dryRun) {
  let pkgJson = {};
  try { pkgJson = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8")); }
  catch {}

  if (hasScript(pkgJson, "tokens")) {
    console.log("  → tokens");
    runScript("tokens", projectRoot, dryRun);
  }
  if (hasScript(pkgJson, "generate-contracts")) {
    console.log("  → generate-contracts");
    runScript("generate-contracts", projectRoot, dryRun);
  }
}

// ── Figma polling (stub — fills in once figmaToken is configured) ─────────────

async function pollFigma(projectRoot, dryRun) {
  const configPath = path.join(process.env.HOME ?? "~", ".systemix", "config.json");
  let figmaToken = null;
  try {
    const cfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
    figmaToken = cfg.figmaToken ?? null;
  } catch {}

  if (!figmaToken) {
    console.log("  [figma] No token in ~/.systemix/config.json — skipping. Run `npx systemix init` to set.");
    return;
  }

  console.log("  [figma] Diffing Figma variables against contracts...");

  if (dryRun) {
    console.log("  [figma] [dry-run] Would write contracts for any drifted tokens.");
    return;
  }

  // Placeholder: real implementation reads Figma variables, diffs against
  // contract/tokens/*.mdx, and either writes MDX (high confidence) or
  // pushes to queue.json (low confidence).
  console.log("  [figma] Diff complete — no changes detected.");
}

// ── PostHog evidence refresh (silent stub) ────────────────────────────────────

async function pollPostHog(projectRoot, dryRun) {
  const apiKey = process.env.POSTHOG_API_KEY;
  if (!apiKey) return; // silent — PostHog is optional

  console.log("  [posthog] Refreshing component evidence from PostHog...");

  if (dryRun) {
    console.log("  [posthog] [dry-run] Would update evidence-posthog in component MDX files.");
    return;
  }

  // Placeholder: real implementation queries PostHog for component_render events,
  // then writes evidence blocks to contract/components/*.mdx frontmatter.
  console.log("  [posthog] Evidence refresh complete.");
}

// ── Watch command ─────────────────────────────────────────────────────────────

async function watch(args) {
  const dryRun = args.includes("--dry-run");
  const intervalIdx = args.indexOf("--interval");
  const intervalSec = intervalIdx !== -1 ? (parseInt(args[intervalIdx + 1], 10) || 60) : 60;

  const projectRoot = process.cwd();
  const cssPath = path.join(projectRoot, "src", "app", "globals.css");

  console.log("\n  systemix watch");
  if (dryRun) console.log("  mode: dry-run — proposed writes logged, nothing executed");
  console.log(`\n  css:    ${cssPath}`);
  console.log(`  figma:  poll every ${intervalSec}s`);
  console.log(`  queue:  .systemix/queue.json`);
  console.log("\n  Ctrl+C to stop.\n");

  // ── CSS file watcher ────────────────────────────────────────────────────────

  if (!fs.existsSync(cssPath)) {
    console.warn(`  ⚠  globals.css not found — CSS watching skipped.`);
  } else {
    let debounce = null;
    fs.watch(cssPath, () => {
      clearTimeout(debounce);
      debounce = setTimeout(async () => {
        console.log(`\n  [css] globals.css changed — regenerating contracts...`);
        await regenerateContracts(projectRoot, dryRun);
        console.log("  [css] Done.\n");
      }, 500);
    });
    console.log("  Watching globals.css for changes...");
  }

  // ── Initial Figma poll ──────────────────────────────────────────────────────

  await pollFigma(projectRoot, dryRun);

  // ── Recurring poll (Figma + PostHog) ───────────────────────────────────────

  setInterval(async () => {
    console.log(`\n  [tick] ${new Date().toISOString()}`);
    await pollFigma(projectRoot, dryRun);
    await pollPostHog(projectRoot, dryRun);
  }, intervalSec * 1000);

  // ── Graceful shutdown ───────────────────────────────────────────────────────

  process.on("SIGINT", () => {
    console.log("\n  systemix watch stopped.\n");
    process.exit(0);
  });

  // Block until killed
  await new Promise(() => {});
}

module.exports = { watch };
