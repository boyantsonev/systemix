// Renders the real Button/Input/Select components across every variant and
// size — a live reference, not a mockup, so this page can't drift from
// src/components/ui/* the way the old hand-copied CTA markup did.

import type { ReactNode } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VariantProps } from "class-variance-authority";

type Variant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type Size = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

const VARIANTS: Variant[] = ["primary", "secondary", "outline", "ghost", "link", "destructive"];
const SIZES: Size[] = ["xs", "sm", "default", "lg"];
const ICON_SIZES: Size[] = ["icon-xs", "icon-sm", "icon", "icon-lg"];

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border/40 py-4 last:border-b-0">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/60">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function ButtonReference() {
  return (
    <div className="not-prose flex flex-col gap-10">
      <div>
        <h3 className="mb-1 text-[15px] font-bold text-foreground">Button</h3>
        <div className="rounded-xl border border-border/50 bg-card p-5">
          {VARIANTS.map((variant) => (
            <Row key={variant} label={variant}>
              {SIZES.map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {size}
                </Button>
              ))}
              <Button variant={variant} disabled>
                disabled
              </Button>
            </Row>
          ))}
          <Row label="icon sizes">
            {ICON_SIZES.map((size) => (
              <Button key={size} variant="secondary" size={size}>
                <ArrowRightIcon />
              </Button>
            ))}
          </Row>
        </div>
      </div>

      <div>
        <h3 className="mb-1 text-[15px] font-bold text-foreground">Input</h3>
        <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-5 sm:flex-row">
          <Input placeholder="you@company.com" className="flex-1" />
          <Input defaultValue="already typed" className="flex-1" />
          <Input placeholder="disabled" disabled className="flex-1" />
          <Input placeholder="invalid" aria-invalid className="flex-1" />
        </div>
      </div>

      <div>
        <h3 className="mb-1 text-[15px] font-bold text-foreground">Select</h3>
        <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-5 sm:flex-row">
          <Select>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one">One</SelectItem>
              <SelectItem value="two">Two</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="two">
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one">One</SelectItem>
              <SelectItem value="two">Two</SelectItem>
            </SelectContent>
          </Select>
          <Select disabled>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="disabled" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one">One</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
