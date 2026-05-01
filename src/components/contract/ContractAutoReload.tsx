"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function ContractAutoReload({ slug }: { slug: string }) {
  const router = useRouter()

  useEffect(() => {
    const es = new EventSource("/api/events/stream")

    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data)
        if (
          event.type === "contract-updated" &&
          typeof event.slug === "string" &&
          event.slug.toLowerCase() === slug.toLowerCase()
        ) {
          router.refresh()
        }
      } catch {}
    }

    return () => es.close()
  }, [slug, router])

  return null
}
