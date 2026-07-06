"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PERSONAS, personaContent } from "@/lib/landing/personas";

/** "For you ▾" nav entry — routes to the /for/<persona> pages. */
export function PersonaNavDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground outline-none">
        For you ▾
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {PERSONAS.map((key) => (
          <DropdownMenuItem key={key} asChild>
            <Link href={`/for/${key}`}>{personaContent[key].navLabel}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
