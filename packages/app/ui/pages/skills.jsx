// #/skills — the instance's installed skills + generated workflows. Viewer
// only: skills run in Claude Code, not here.
import React from 'react'
import { GuideNote, useApp } from '../app.jsx'
import { asJson, useApi } from '../lib.js'

export default function Skills() {
  const { view } = useApp()
  const { data, error, loading } = useApi('/api/skills')
  if (loading) return <div className="empty-note">Loading…</div>
  if (error) return <div className="empty-note">Failed to load skills: {error.error}</div>

  if (view === 'machine') {
    return (
      <>
        <div className="eyebrow">GET /api/skills</div>
        <pre className="machine-pre">{asJson(data)}</pre>
      </>
    )
  }

  const { skills, workflows } = data

  return (
    <>
      <div className="eyebrow">Skills</div>
      <h1>Skills &amp; workflows</h1>

      {skills.length === 0 ? (
        <GuideNote
          hint="no skills in .claude/skills/ yet — initializing the instance installs the loop skills"
          command="npx @getsystemix/cli init"
        />
      ) : (
        <div className="skill-grid">
          {skills.map((s) => (
            <div key={s.dir} className="card skill-card">
              <div className="eyebrow">installed in this repo</div>
              <div className="skill-name">/{s.name}</div>
              {s.description && <p className="skill-desc muted">{s.description}</p>}
            </div>
          ))}
        </div>
      )}

      <h2>Workflows</h2>
      {workflows.length === 0 ? (
        <div className="empty-note">
          no generated workflows in <code>.claude/workflows/</code> — <code>/atlas</code> generates a
          topology-aware loop workflow.
        </div>
      ) : (
        <div className="card tl-list">
          {workflows.map((w) => (
            <div key={w.file} className="tl-row">
              <span className="exp-id">{w.name}</span>
              <span className="tl-row-meta">{w.file}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
