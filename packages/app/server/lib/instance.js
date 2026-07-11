// Instance readers — plain-fs views over a systemix instance's files.
// The app is a VIEWER + HITL actuator over the SAME files the skills, CLI and
// MCP use (three-doors parity): no new state, no new semantics. Fresh
// projectRoot-scoped ports of the POC's src/lib readers (queue-store,
// drift-history, learnings) — follow-up: extract a shared instance-lib.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import YAML from 'yaml'

const readJson = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

const readText = (file) => {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch {
    return null
  }
}

export function loadConfig(root) {
  const raw = readText(path.join(root, 'systemix.config.yaml'))
  let config = null
  try {
    config = raw ? YAML.parse(raw) : null
  } catch {
    config = null
  }
  return { raw, config, instance: path.basename(root) }
}

export function loadDocsManifest(root) {
  return readJson(path.join(root, 'docs', 'manifest.json'), null)
}

export function loadDoc(root, slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null
  const file = path.join(root, 'docs', 'components', `${slug}.md`)
  const raw = readText(file)
  if (raw == null) return null
  const { data, content } = matter(raw)
  return { slug, frontmatter: data, body: content, raw }
}

export function loadTokens(root, config) {
  const cssPath = config?.design?.tokens ?? 'design/tokens.css'
  const css = readText(path.join(root, cssPath))
  // optional generated-values seam: config app.tokens_generated: [paths]
  const generatedPaths = config?.app?.tokens_generated ?? []
  const generated = {}
  for (const p of generatedPaths) {
    generated[p] = readText(path.join(root, p))
  }
  return { cssPath, css, generated }
}

export function loadExperiments(root) {
  const dir = path.join(root, 'experiments')
  let files = []
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))
  } catch {
    return { experiments: [], learnings: null }
  }
  const experiments = files
    .map((f) => {
      const raw = readText(path.join(dir, f))
      if (raw == null) return null
      try {
        const { data, content } = matter(raw)
        return { file: `experiments/${f}`, frontmatter: data, body: content }
      } catch {
        return null
      }
    })
    .filter(Boolean)
    .sort((a, b) => String(b.frontmatter.created ?? '').localeCompare(String(a.frontmatter.created ?? '')))
  const learnings = readText(path.join(dir, 'LEARNINGS.md'))
  return { experiments, learnings }
}

// ---- HITL: two queue files exist today (unification is a follow-up) ----
// .systemix/queue.json      — CLI/dashboard decision cards {cards:[...]}
// .systemix/hitl-queue.json — MCP task queue {tasks:[...]}
const QUEUE = (root) => path.join(root, '.systemix', 'queue.json')
const HITL = (root) => path.join(root, '.systemix', 'hitl-queue.json')

export function loadQueue(root) {
  const cards = (readJson(QUEUE(root), {}).cards ?? []).map((c) => ({ ...c, _source: 'queue' }))
  const tasks = (readJson(HITL(root), {}).tasks ?? []).map((t) => ({ ...t, _source: 'hitl' }))
  const items = [...cards, ...tasks].sort((a, b) => {
    const ap = a.status === 'pending' ? 0 : 1
    const bp = b.status === 'pending' ? 0 : 1
    if (ap !== bp) return ap - bp
    const at = a.requestedAt ?? a.createdAt ?? ''
    const bt = b.requestedAt ?? b.createdAt ?? ''
    return String(bt).localeCompare(String(at))
  })
  return { items, pendingCount: items.filter((i) => i.status === 'pending').length }
}

function atomicWrite(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const tmp = file + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2))
  fs.renameSync(tmp, file)
}

/**
 * Resolve an item in whichever queue holds it. v1 deliberately writes ONLY
 * status + resolution (same shape as the POC dashboard/MCP) and returns a
 * nextHint — applying an experiment decision to MDX stays with the CLI/skills
 * so the app never grows write semantics of its own.
 */
export function resolveQueueItem(root, id, { action, note, resolvedBy }) {
  if (!action) return { error: 'action required', status: 400 }
  const now = new Date().toISOString()

  const queueData = readJson(QUEUE(root), null)
  const card = queueData?.cards?.find((c) => c.id === id)
  if (card) {
    if (card.status !== 'pending') return { error: 'already resolved', status: 409 }
    card.status = action === 'approve' ? 'approved' : 'declined'
    card.resolvedAt = now
    card.resolution = { action, note: note ?? null, resolvedBy: resolvedBy ?? 'human:app' }
    atomicWrite(QUEUE(root), queueData)
    const nextHint =
      card.type === 'close-proposal' && action === 'approve' && card.experimentId
        ? `apply the decision: npx systemix experiment close ${card.experimentId}`
        : card.type === 'hypothesis-proposal' && action === 'approve'
          ? 'scaffold it: npx systemix experiment new <id> (or /init-experiment)'
          : null
    return { item: card, nextHint }
  }

  const hitlData = readJson(HITL(root), null)
  const task = hitlData?.tasks?.find((t) => t.id === id)
  if (task) {
    if (task.status !== 'pending') return { error: 'already resolved', status: 409 }
    task.status = 'resolved'
    task.resolvedAt = now
    task.resolution = { action, note: note ?? null, resolvedBy: resolvedBy ?? 'human:app' }
    atomicWrite(HITL(root), hitlData)
    return { item: task, nextHint: null }
  }

  return { error: 'not found', status: 404 }
}

export function loadDrift(root) {
  const raw = readJson(path.join(root, '.systemix', 'drift-history.json'), { snapshots: [] })
  const snapshots = Array.isArray(raw) ? raw : (raw.snapshots ?? [])
  // the other strand of the sacred timeline: canonical-token history from git
  let tokensLog = []
  try {
    const { config } = loadConfig(root)
    const tokensPath = config?.design?.tokens ?? 'design/tokens.css'
    const out = execFileSync(
      'git',
      ['log', '--follow', '--format=%h\t%aI\t%s', '--max-count=60', '--', tokensPath],
      { cwd: root, encoding: 'utf8', timeout: 5000 }
    )
    tokensLog = out
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [hash, date, ...subject] = line.split('\t')
        return { hash, date, subject: subject.join('\t') }
      })
  } catch {
    tokensLog = [] // not a git repo / git unavailable — the timeline renders snapshots only
  }
  return { snapshots, tokensLog }
}

export function loadHome(root) {
  const { config, instance } = loadConfig(root)
  const manifest = loadDocsManifest(root)
  const { experiments } = loadExperiments(root)
  const { pendingCount } = loadQueue(root)
  const drift = loadDrift(root)
  const snapshots = drift.snapshots ?? drift ?? []
  const latestDrift = Array.isArray(snapshots) && snapshots.length ? snapshots[snapshots.length - 1] : null
  return {
    instance,
    context: config?.context ?? null,
    autonomy: config?.hermes?.autonomy ?? null,
    signals: config?.signals ?? null,
    preview: config?.app?.preview ?? null,
    counts: {
      components: manifest?.count ?? 0,
      experimentsRunning: experiments.filter((e) => e.frontmatter.status === 'running').length,
      experimentsTotal: experiments.length,
      queuePending: pendingCount,
    },
    latestDrift,
  }
}
