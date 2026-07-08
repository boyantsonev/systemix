"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";

// The Readiness Audit request form (Rung 1). Fires `audit_requested` (the funnel
// metric) and opens a pre-filled email — the honest zero-infra delivery, matching
// the site's other conversions (book_a_call / brand_clone are mailto too). A stored
// file wouldn't survive Vercel's ephemeral filesystem, so mailto actually reaches a
// human. The "how are you building" qualifier mirrors getdesign.md/request's own.
const QUALIFIERS = [
  "Solo, shipping with agents",
  "A small team",
  "An agency / client work",
  "Just exploring",
] as const;

const AUDIT_EMAIL = "boyan.works@gmail.com";

export function AuditRequestForm() {
  const ph = usePostHog();
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [qualifier, setQualifier] = useState<string>(QUALIFIERS[0]);
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    ph?.capture("audit_requested", {
      location: "audit-page",
      qualifier,
      has_url: !!url.trim(),
    });
    const subject = encodeURIComponent("Systemix Readiness Audit request");
    const body = encodeURIComponent(
      `Repo / site: ${url}\nEmail: ${email}\nHow I'm building: ${qualifier}\n\n— sent from /audit`,
    );
    window.location.href = `mailto:${AUDIT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-6 text-center">
        <p className="text-[15px] font-bold text-foreground">Request received.</p>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          Your mail client should have opened a pre-filled email — send it and I&apos;ll reply the
          same day with your readiness report and the seed of the fix.
        </p>
      </div>
    );
  }

  const inputCls =
    "mt-1.5 w-full rounded-lg border border-border/60 bg-background px-3.5 py-2.5 text-[14px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground/40";

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-6">
      <label className="block">
        <span className="text-[13px] font-medium text-foreground">Repo or site URL</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="github.com/you/app  ·  or  app.yourdomain.com"
          className={inputCls}
        />
      </label>
      <label className="block">
        <span className="text-[13px] font-medium text-foreground">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@company.com"
          className={inputCls}
        />
      </label>
      <label className="block">
        <span className="text-[13px] font-medium text-foreground">How are you building right now?</span>
        <select value={qualifier} onChange={(e) => setQualifier(e.target.value)} className={inputCls}>
          {QUALIFIERS.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="mt-1 rounded-full bg-foreground px-5 py-3 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
      >
        Request the report →
      </button>
      <p className="text-center font-mono text-[11px] text-muted-foreground/50">
        Free · one-time · no spam
      </p>
    </form>
  );
}
