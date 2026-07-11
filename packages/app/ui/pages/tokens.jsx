// #/tokens — swatches + table (human) / raw css + generated files (machine).
import React from 'react'
import { useApp } from '../app.jsx'
import { groupByPrefix, looksLikeColor, parseTokenBlocks, useApi } from '../lib.js'

export default function Tokens() {
  const { view } = useApp()
  const { data, error, loading } = useApi('/api/tokens')
  if (loading) return <div className="empty-note">Loading…</div>
  if (error) return <div className="empty-note">Failed to load tokens: {error.error}</div>

  if (view === 'machine') {
    return (
      <>
        <div className="eyebrow">{data.cssPath}</div>
        <pre className="machine-pre">{data.css ?? '(missing)'}</pre>
        {Object.entries(data.generated ?? {}).map(([p, content]) => (
          <React.Fragment key={p}>
            <div className="eyebrow">{p}</div>
            <pre className="machine-pre">{content ?? '(missing)'}</pre>
          </React.Fragment>
        ))}
      </>
    )
  }

  if (!data.css) {
    return (
      <div className="empty-note">
        No token file at <code>{data.cssPath}</code>.
      </div>
    )
  }

  const blocks = parseTokenBlocks(data.css)
  return (
    <>
      <div className="eyebrow">Tokens</div>
      <h1>Design tokens</h1>
      <p className="muted mono-path">{data.cssPath}</p>
      {blocks.length === 0 && (
        <div className="empty-note">
          No <code>:root</code> / <code>.dark</code> custom properties found — switch to Machine view for the raw file.
        </div>
      )}
      {blocks.map((block) => (
        <section key={block.selector} className="token-block">
          <h2>
            <code>{block.selector}</code> <span className="muted">({block.vars.length} tokens)</span>
          </h2>
          {groupByPrefix(block.vars).map(({ prefix, items }) => {
            const colors = items.filter((v) => looksLikeColor(v.value))
            const rest = items.filter((v) => !looksLikeColor(v.value))
            return (
              <div key={prefix} className="token-group">
                <div className="eyebrow">{prefix}</div>
                {colors.length > 0 && (
                  <div className="swatch-grid">
                    {colors.map((v) => (
                      <div key={v.name} className="swatch">
                        <div className="swatch-chip" style={{ background: v.value }} />
                        <div className="swatch-name">{v.name}</div>
                        <div className="swatch-value">{v.value}</div>
                      </div>
                    ))}
                  </div>
                )}
                {rest.length > 0 && (
                  <div className="md-table-wrap">
                    <table className="token-table">
                      <tbody>
                        {rest.map((v) => (
                          <tr key={v.name}>
                            <td>
                              <code>{v.name}</code>
                            </td>
                            <td>{v.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </section>
      ))}
    </>
  )
}
