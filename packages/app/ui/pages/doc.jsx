// #/docs/:slug — frontmatter header + rendered md + iframe preview (human);
// manifest entry JSON + raw md (machine).
import React from 'react'
import { useApp } from '../app.jsx'
import { asJson, mdToHtml, useApi } from '../lib.js'

export default function Doc({ slug }) {
  const { view, home, manifest } = useApp()
  const { data, error, loading } = useApi(`/api/docs/${slug}`)
  if (loading) return <div className="empty-note">Loading…</div>
  if (error) return <div className="empty-note">Doc not found: {error.error ?? slug}</div>

  const entry = manifest?.components?.find((c) => c.slug === slug) ?? null

  if (view === 'machine') {
    return (
      <>
        <div className="eyebrow">manifest entry</div>
        <pre className="machine-pre">{entry ? asJson(entry) : '(not in manifest)'}</pre>
        <div className="eyebrow">docs/components/{slug}.md</div>
        <pre className="machine-pre">{data.raw}</pre>
      </>
    )
  }

  const fm = data.frontmatter ?? {}
  const preview = home?.preview
  const previewSrc =
    preview?.url && (fm.gallery || preview.per_slug)
      ? preview.per_slug
        ? `${preview.url}/preview/${slug}`
        : `${preview.url}${fm.gallery ?? ''}`
      : null

  return (
    <>
      <div className="eyebrow">{fm.group ?? 'component'}</div>
      <div className="doc-head">
        <h1>{fm.name ?? slug}</h1>
        {fm.status && <span className={fm.status === 'ported' ? 'chip chip-green' : 'chip chip-amber'}>{fm.status}</span>}
      </div>
      {fm.source && <p className="muted mono-path">{fm.source}</p>}
      {fm.platforms && (
        <div className="chip-row">
          {[].concat(fm.platforms).map((p) => (
            <span key={p} className="chip">
              {p}
            </span>
          ))}
        </div>
      )}

      {previewSrc && (
        <div className="card preview-card">
          <div className="eyebrow">Live preview</div>
          <iframe className="preview-frame" src={previewSrc} title={`${slug} preview`} loading="lazy" />
          <div className="muted mono-path">{previewSrc}</div>
        </div>
      )}

      <div className="md" dangerouslySetInnerHTML={{ __html: mdToHtml(data.body) }} />
    </>
  )
}
