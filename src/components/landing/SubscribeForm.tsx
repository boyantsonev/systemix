'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type State = 'idle' | 'loading' | 'success' | 'error'

export function SubscribeForm() {
  const [state, setState] = useState<State>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const email = inputRef.current?.value ?? ''
    if (!email) return

    setState('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setState(res.ok ? 'success' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <p className="text-[14px] text-muted-foreground font-mono">
        You&apos;re on the list. We&apos;ll be in touch.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm mx-auto">
      <Input
        ref={inputRef}
        type="email"
        required
        placeholder="you@company.com"
        className="flex-1"
      />
      <Button type="submit" variant="secondary" disabled={state === 'loading'} size="default">
        {state === 'loading' ? '…' : 'Subscribe'}
      </Button>
    </form>
  )
}
