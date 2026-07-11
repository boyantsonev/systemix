// App shell — header (view switch), sidebar folder tree, hash router.
import React, { createContext, useContext, useState } from 'react'
import { useApi, useHashRoute } from './lib.js'
import Doc from './pages/doc.jsx'
import Experiments from './pages/experiments.jsx'
import Home from './pages/home.jsx'
import Queue from './pages/queue.jsx'
import Tokens from './pages/tokens.jsx'

export const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const VIEW_KEY = 'systemix-app-view'

export default function App() {
  const [view, setViewState] = useState(() => {
    const v = localStorage.getItem(VIEW_KEY)
    return v === 'machine' ? 'machine' : 'human'
  })
  const setView = (v) => {
    localStorage.setItem(VIEW_KEY, v)
    setViewState(v)
  }
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey((k) => k + 1)

  const route = useHashRoute()
  const home = useApi('/api/home', [refreshKey])
  const manifest = useApi('/api/docs/manifest', [refreshKey])

  const ctx = {
    view,
    setView,
    home: home.data,
    manifest: manifest.data,
    manifestError: manifest.error,
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
  if (route === '/tokens') return <Tokens />
  const doc = route.match(/^\/docs\/([a-z0-9-]+)$/)
  if (doc) return <Doc slug={doc[1]} />
  if (route === '/experiments') return <Experiments />
  if (route === '/queue') return <Queue />
  return (
    <div className="empty-note">
      Nothing at <code>#{route}</code> — <a href="#/">back home</a>
    </div>
  )
}

function Header() {
  const { view, setView, home } = useApp()
  return (
    <header className="header">
      <div className="header-id">
        <span className="instance-name">{home?.instance ?? '…'}</span>
        <span className="wordmark">systemix</span>
      </div>
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
    </header>
  )
}

// ---- sidebar ---------------------------------------------------------------

function Sidebar({ route }) {
  const { home, manifest, manifestError } = useApp()
  const [dsOpen, setDsOpen] = useState(true)
  const activeSlug = (route.match(/^\/docs\/([a-z0-9-]+)$/) || [])[1] ?? null

  const running = home?.counts?.experimentsRunning ?? 0
  const pending = home?.counts?.queuePending ?? 0

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
          <a className={route === '/tokens' ? 'nav-item active' : 'nav-item'} href="#/tokens">
            Tokens
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
