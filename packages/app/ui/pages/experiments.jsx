// #/experiments — list with expandable detail + LEARNINGS memory.
import React, { useState } from 'react'
import { useApp } from '../app.jsx'
import { asJson, fmtDate, mdToHtml, useApi } from '../lib.js'

const STATUS_CLASS = {
  running: 'chip chip-green',
  closed: 'chip chip-muted',
  decided: 'chip chip-muted',
}

export default function Experiments() {
  const { view } = useApp()
  const { data, error, loading } = useApi('/api/experiments')
  const [openFile, setOpenFile] = useState(null)
  if (loading) return <div className="empty-note">Loading…</div>
  if (error) return <div className="empty-note">Failed to load experiments: {error.error}</div>

  const { experiments, learnings } = data

  return (
    <>
      <div className="eyebrow">Experiments</div>
      <h1>Experiments</h1>

      {experiments.length === 0 && (
        <div className="empty-note">
          No experiments yet — start one with <code>/init-experiment</code>.
        </div>
      )}

      <div className="exp-list">
        {experiments.map((e) => {
          const fm = e.frontmatter ?? {}
          const id = fm.id ?? e.file
          const open = openFile === e.file
          return (
            <div key={e.file} className="card exp-card">
              <button type="button" className="exp-row" onClick={() => setOpenFile(open ? null : e.file)}>
                <span className={open ? 'twist open' : 'twist'}>&#9656;</span>
                <span className="exp-id">{id}</span>
                {fm.status && <span className={STATUS_CLASS[fm.status] ?? 'chip'}>{fm.status}</span>}
                <span className="exp-meta">
                  {fm.goal && <span title="goal">{fm.goal}</span>}
                  {fm.metric && <span title="metric">· {fm.metric}</span>}
                </span>
                <span className="exp-dates">
                  {fmtDate(fm.created) && <span>created {fmtDate(fm.created)}</span>}
                  {fmtDate(fm['review-by']) && <span> · review by {fmtDate(fm['review-by'])}</span>}
                </span>
              </button>
              {open &&
                (view === 'machine' ? (
                  <div className="exp-detail">
                    <div className="eyebrow">frontmatter</div>
                    <pre className="machine-pre">{asJson(fm)}</pre>
                    <div className="eyebrow">body</div>
                    <pre className="machine-pre">{e.body}</pre>
                  </div>
                ) : (
                  <div className="exp-detail">
                    <dl className="kv">
                      {Object.entries(fm)
                        .filter(([, v]) => v != null && v !== '')
                        .map(([k, v]) => (
                          <React.Fragment key={k}>
                            <dt>{k}</dt>
                            <dd>{typeof v === 'string' || typeof v === 'number' ? String(v) : asJson(v)}</dd>
                          </React.Fragment>
                        ))}
                    </dl>
                    <div className="md" dangerouslySetInnerHTML={{ __html: mdToHtml(e.body) }} />
                  </div>
                ))}
            </div>
          )
        })}
      </div>

      {learnings != null && (
        <section className="memory">
          <div className="eyebrow">Memory</div>
          {view === 'machine' ? (
            <pre className="machine-pre">{learnings}</pre>
          ) : (
            <div className="md" dangerouslySetInnerHTML={{ __html: mdToHtml(learnings) }} />
          )}
        </section>
      )}
    </>
  )
}
