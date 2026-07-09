import { loader } from "fumadocs-core/source";
import { design } from "../../.source/server";

// Fumadocs loader for the Design System surface — the POC's own design/ spine
// (DESIGN.md · guardrails · tokens) rendered at /design. Mirror of
// contract-source.ts.
export const designSource = loader({
  baseUrl: "/design",
  source: design.toFumadocsSource(),
});
