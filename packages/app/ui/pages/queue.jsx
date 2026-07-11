// #/queue — the HITL stream: pending cards get Approve / Decline.
import React, { useState } from 'react'
import { useApp } from '../app.jsx'
import { asJson, useApi } from '../lib.js'

export default function Queue() {
  const { view, refresh } = useApp()
  const [tick, setTick] = useState(0)
  const { data, error, loading } = useApi('/api/queue', [tick])
  const [note, setNote] = useState(null) // { kind: 'ok'|'err', text }
  const [busyId, setBusyId] = useState(null)

  const resolve = async (id, action) => {
    setBusyId(id)
    setNote(null)
    try {
      const r = await fetch(`/api/queue/${encodeURIComponent(id)}/resolve`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const body = await r.json().catch(() => null)
      if (!r.ok) setNote({ kind: 'err', text: body?.error ?? `HTTP ${r.status}` })
      else setNote({ kind: 'ok', text: body?.nextHint ?? `${action === 'approve' ? 'Approved' : 'Declined'}.` })
    } catch (e) {
      setNote({ kind: 'err', text: String(e) })
    } finally {
      setBusyId(null)
      setTick((t) => t + 1) // refetch the queue
      refresh() // refresh sidebar badges / home counts
    }
  }

  if (loading && !data) return <div className="empty-note">Loading…</div>
  if (error) return <div className="empty-note">Failed to load queue: {error.error}</div>

  if (view === 'machine') {
    return (
      <>
        <div className="eyebrow">GET /api/queue</div>
        {note && <div className={note.kind === 'ok' ? 'toast toast-ok' : 'toast toast-err'}>{note.text}</div>}
        <pre className="machine-pre">{asJson(data)}</pre>
      </>
    )
  }

  return (
    <>
      <div className="eyebrow">Queue</div>
      <h1>
        HITL queue{' '}
        {data.pendingCount > 0 && <span className="chip chip-amber">{data.pendingCount} pending</span>}
      </h1>

      {note && <div className={note.kind === 'ok' ? 'toast toast-ok' : 'toast toast-err'}>{note.text}</div>}

      {data.items.length === 0 && <div className="empty-note">Queue is empty — nothing needs a human right now.</div>}

      {data.items.map((item) => (
        <QueueCard key={`${item._source}:${item.id}`} item={item} busy={busyId === item.id} onResolve={resolve} />
      ))}
    </>
  )
}

function QueueCard({ item, busy, onResolve }) {
  const pending = item.status === 'pending'
  const subject = item.subject ?? item.experimentId ?? item.title ?? item.id
  const when = item.requestedAt ?? item.createdAt ?? null
  const payload = item.payload ?? item.summary ?? item.body ?? null

  return (
    <div className={pending ? 'card queue-card' : 'card queue-card resolved'}>
      <div className="queue-head">
        <span className={pending ? 'chip chip-amber' : 'chip chip-muted'}>{item.type ?? item._source}</span>
        <span className="queue-subject">{subject}</span>
        {when && <span className="queue-when">{String(when).replace('T', ' ').slice(0, 16)}</span>}
      </div>
      {payload != null && (
        <pre className="queue-payload">{typeof payload === 'string' ? payload : asJson(payload)}</pre>
      )}
      {pending ? (
        <div className="queue-actions">
          <button type="button" className="btn btn-approve" disabled={busy} onClick={() => onResolve(item.id, 'approve')}>
            Approve
          </button>
          <button type="button" className="btn btn-decline" disabled={busy} onClick={() => onResolve(item.id, 'decline')}>
            Decline
          </button>
        </div>
      ) : (
        <div className="queue-resolution muted">
          {item.status}
          {item.resolution?.action && ` — ${item.resolution.action}`}
          {item.resolution?.note && ` · ${item.resolution.note}`}
          {item.resolvedAt && ` · ${String(item.resolvedAt).replace('T', ' ').slice(0, 16)}`}
        </div>
      )}
    </div>
  )
}
