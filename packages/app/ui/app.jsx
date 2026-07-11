// App shell — header (view switch), sidebar folder tree, hash router,
// instance theming (the app wears the instance's own tokens).
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useApi, useHashRoute } from './lib.js'
import DesignDoc from './pages/design.jsx'
import Doc from './pages/doc.jsx'
import Experiments from './pages/experiments.jsx'
import Home from './pages/home.jsx'
import Queue from './pages/queue.jsx'
import Skills from './pages/skills.jsx'
import Timeline from './pages/timeline.jsx'
import Tokens from './pages/tokens.jsx'

export const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const VIEW_KEY = 'systemix-app-view'
const THEME_KEY = 'systemix-app-theme'

// styles.css vars the instance theme is allowed to override
const MANAGED_VARS = [
  '--paper',
  '--ink',
  '--card',
  '--hairline',
  '--muted',
  '--amber',
  '--green',
  '--red',
  '--ring',
  '--amber-soft',
  '--green-soft',
]

/** Map the instance's semantic tokens onto the app's own palette vars. */
function applyTheme(theme, mode) {
  const el = document.documentElement
  if (!theme) {
    MANAGED_VARS.forEach((v) => el.style.removeProperty(v))
    el.style.removeProperty('color-scheme')
    return
  }
  const s = theme[mode] ?? theme.light ?? {}
  const attention = s.warning ?? s.ring
  const map = {
    '--paper': s.background,
    '--ink': s.foreground,
    '--card': s.card,
    '--hairline': s.border,
    '--muted': s.mutedForeground,
    '--amber': attention,
    '--green': s.success,
    '--red': s.danger,
    '--ring': s.ring,
    // soft tints derived from the theme so chips/badges hold up in both scopes
    '--amber-soft': attention ? 'color-mix(in oklab, var(--amber) 15%, var(--card))' : null,
    '--green-soft': s.success ? 'color-mix(in oklab, var(--green) 15%, var(--card))' : null,
  }
  for (const [k, v] of Object.entries(map)) {
    if (v) el.style.setProperty(k, v)
    else el.style.removeProperty(k)
  }
  el.style.colorScheme = mode
}

export default function App() {
  const [view, setViewState] = useState(() => {
    const v = localStorage.getItem(VIEW_KEY)
    return v === 'machine' ? 'machine' : 'human'
  })
  const setView = (v) => {
    localStorage.setItem(VIEW_KEY, v)
    setViewState(v)
  }
  const [themeMode, setThemeModeState] = useState(() => {
    const t = localStorage.getItem(THEME_KEY)
    if (t === 'dark' || t === 'light') return t
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const setThemeMode = (m) => {
    localStorage.setItem(THEME_KEY, m)
    setThemeModeState(m)
  }
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey((k) => k + 1)

  const route = useHashRoute()
  const home = useApi('/api/home', [refreshKey])
  const manifest = useApi('/api/docs/manifest', [refreshKey])
  const skills = useApi('/api/skills', [refreshKey])

  useEffect(() => {
    applyTheme(home.data?.theme ?? null, themeMode)
  }, [home.data?.theme, themeMode])

  const ctx = {
    view,
    setView,
    themeMode,
    setThemeMode,
    home: home.data,
    manifest: manifest.data,
    manifestError: manifest.error,
    skills: skills.data,
    refresh,
  }

  return (
    <AppContext.Provider value={ctx}>
      <div className="app">
        <Sidebar route={route} />
        <div className="main">
          <Header />
          <div className="content">
            <PageFor route={route} />
          </div>
        </div>
      </div>
    </AppContext.Provider>
  )
}

function PageFor({ route }) {
  if (route === '/' || route === '') return <Home />
  if (route === '/design') return <DesignDoc kind="design" />
  if (route === '/guardrails') return <DesignDoc kind="guardrails" />
  if (route === '/tokens') return <Tokens />
  if (route === '/timeline') return <Timeline />
  const doc = route.match(/^\/docs\/([a-z0-9-]+)$/)
  if (doc) return <Doc slug={doc[1]} />
  if (route === '/experiments') return <Experiments />
  if (route === '/queue') return <Queue />
  if (route === '/skills') return <Skills />
  return (
    <div className="empty-note">
      Nothing at <code>#{route}</code> — <a href="#/">back home</a>
    </div>
  )
}

function Header() {
  const { view, setView, home, themeMode, setThemeMode } = useApp()
  return (
    <header className="header">
      <div className="header-id">
        <div className="header-id-row">
          <span className="instance-name">{home?.instance ?? '…'}</span>
          <span className="wordmark">systemix</span>
        </div>
        {home?.projectRoot && <div className="header-path">{home.projectRoot}</div>}
      </div>
      <div className="header-controls">
        {home?.theme && (
          <button
            type="button"
            className="theme-btn"
            title={themeMode === 'dark' ? 'switch to light tokens' : 'switch to dark tokens'}
            aria-label="Toggle light/dark token scope"
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
          >
            {themeMode === 'dark' ? '☾' : '☀'}
          </button>
        )}
        <div className="segmented" role="group" aria-label="View mode">
          {['human', 'machine'].map((v) => (
            <button
              key={v}
              type="button"
              className={view === v ? 'seg-btn active' : 'seg-btn'}
              aria-pressed={view === v}
              onClick={() => setView(v)}
            >
              {v === 'human' ? 'Human' : 'Machine'}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

// ---- guided empty states (shared) ------------------------------------------

export function CopyCmd({ command }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(command).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return (
    <button type="button" className="copy-cmd" onClick={copy} title="click to copy">
      <code>{command}</code>
      <span className="copy-flag">{copied ? 'copied' : 'copy'}</span>
    </button>
  )
}

/** One phrasing for every "this isn't set up yet" moment — hint + command. */
export function GuideNote({ hint, command }) {
  return (
    <div className="empty-note guide-note">
      <span>{hint}</span>
      {command && <CopyCmd command={command} />}
    </div>
  )
}

// ---- sidebar ---------------------------------------------------------------

function Sidebar({ route }) {
  const { home, manifest, manifestError, skills } = useApp()
  const [dsOpen, setDsOpen] = useState(true)
  const activeSlug = (route.match(/^\/docs\/([a-z0-9-]+)$/) || [])[1] ?? null

  const running = home?.counts?.experimentsRunning ?? 0
  const pending = home?.counts?.queuePending ?? 0
  const skillCount = skills?.skills?.length ?? 0

  return (
    <nav className="sidebar">
      <a className={route === '/' ? 'nav-item active' : 'nav-item'} href="#/">
        Home
      </a>

      <button type="button" className="nav-item nav-folder" onClick={() => setDsOpen((o) => !o)}>
        <span className={dsOpen ? 'twist open' : 'twist'}>&#9656;</span> Design system
      </button>
      {dsOpen && (
        <div className="nav-children">
          <a className={route === '/design' ? 'nav-item active' : 'nav-item'} href="#/design">
            Overview
          </a>
          <a className={route === '/guardrails' ? 'nav-item active' : 'nav-item'} href="#/guardrails">
            Guardrails
          </a>
          <a className={route === '/tokens' ? 'nav-item active' : 'nav-item'} href="#/tokens">
            Tokens
          </a>
          <a className={route === '/timeline' ? 'nav-item active' : 'nav-item'} href="#/timeline">
            Timeline
            {(home?.latestDrift?.critical ?? 0) > 0 && <span className="nav-dot-amber" aria-label="critical drift" />}
          </a>
          {manifest ? (
            <DocsTree manifest={manifest} activeSlug={activeSlug} />
          ) : (
            <div className="nav-hint">{manifestError?.hint ?? 'no docs manifest'}</div>
          )}
        </div>
      )}

      <a className={route === '/experiments' ? 'nav-item active' : 'nav-item'} href="#/experiments">
        Experiments
        {running > 0 && <span className="badge badge-green">{running}</span>}
      </a>
      <a className={route === '/queue' ? 'nav-item active' : 'nav-item'} href="#/queue">
        Queue
        {pending > 0 ? <span className="badge badge-amber">{pending}</span> : <span className="badge">0</span>}
      </a>
      <a className={route === '/skills' ? 'nav-item active' : 'nav-item'} href="#/skills">
        Skills
        {skillCount > 0 && <span className="badge">{skillCount}</span>}
      </a>
    </nav>
  )
}

function DocsTree({ manifest, activeSlug }) {
  const groups = manifest.groups ?? []
  const components = manifest.components ?? []
  const activeGroup = components.find((c) => c.slug === activeSlug)?.group ?? null
  const [open, setOpen] = useState(() => new Set(activeGroup ? [activeGroup] : []))
  const toggle = (g) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(g)) next.delete(g)
      else next.add(g)
      return next
    })

  return (
    <div className="docs-tree">
      {groups.map((g) => {
        const items = components.filter((c) => c.group === g)
        const isOpen = open.has(g) || g === activeGroup
        return (
          <div key={g}>
            <button type="button" className="nav-item nav-folder" onClick={() => toggle(g)}>
              <span className={isOpen ? 'twist open' : 'twist'}>&#9656;</span> {g}
              <span className="badge">{items.length}</span>
            </button>
            {isOpen && (
              <div className="nav-children">
                {items.map((c) => (
                  <a
                    key={c.slug}
                    className={c.slug === activeSlug ? 'nav-item active' : 'nav-item'}
                    href={`#/docs/${c.slug}`}
                  >
                    {c.name}
                    {c.status && c.status !== 'ported' && <span className="status-hint">{c.status}</span>}
                  </a>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
