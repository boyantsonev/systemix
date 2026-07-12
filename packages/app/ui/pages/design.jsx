// #/design + #/guardrails — the design-system-as-object: DESIGN.md rendered
// (human) / raw md (machine); same pattern for design/guardrails.mdx.
import React from 'react'
import { GuideNote, useApp } from '../app.jsx'
import { mdToHtml, useApi } from '../lib.js'

const META = {
  design: {
    title: 'Overview',
    file: 'design/DESIGN.md',
    hint: 'no design/DESIGN.md yet — the design-system source of truth. Scaffold design/ via init.',
  },
  guardrails: {
    title: 'Guardrails',
    file: 'design/guardrails.mdx',
    hint: 'no design/guardrails.mdx yet — the rules drift checks enforce. Scaffold design/ via init.',
  },
}

export default function DesignDoc({ kind }) {
  const { view } = useApp()
  const { data, error, loading } = useApi('/api/design')
  const meta = META[kind]
  if (loading) return <div className="empty-note">Loading…</div>
  if (error) return <div className="empty-note">Failed to load design docs: {error.error}</div>

  const doc = data?.[kind] ?? null

  if (!doc) {
    return (
      <>
        <div className="eyebrow">Design system</div>
        <h1>{meta.title}</h1>
        <GuideNote hint={meta.hint} command="npx @getsystemix/cli init" />
      </>
    )
  }

  if (view === 'machine') {
    return (
      <>
        <div className="eyebrow">{meta.file}</div>
        <pre className="machine-pre">{doc.raw}</pre>
      </>
    )
  }

  const fm = doc.frontmatter ?? {}
  return (
    <>
      <div className="eyebrow">Design system</div>
      <h1>{kind === 'design' ? (fm.name ?? meta.title) : meta.title}</h1>
      <p className="muted mono-path">{meta.file}</p>
      {fm.description && <p className="muted">{fm.description}</p>}
      {(fm.version || fm.updated) && (
        <div className="chip-row">
          {fm.version && <span className="chip">v: {String(fm.version)}</span>}
          {fm.updated && <span className="chip chip-muted">updated {String(fm.updated)}</span>}
        </div>
      )}
      <div className="md" dangerouslySetInnerHTML={{ __html: mdToHtml(doc.body) }} />
    </>
  )
}
