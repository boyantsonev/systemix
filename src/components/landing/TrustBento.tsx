import { RiGitRepositoryLine, RiLoopRightLine } from "@remixicon/react";
import { SiGithub, SiClaude } from "@icons-pack/react-simple-icons";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { trust } from "@/lib/landing/content";
import { SectionGrid } from "./SectionGrid";
import { MediaSlot } from "./MediaSlot";

/** "loop-demo.gif" → "loop demo" — a readable placeholder label. */
const mediaLabel = (file?: string) =>
  file ? file.replace(/\.(gif|mp4|png|webm)$/i, "").replace(/-/g, " ") : "media";

const ICONS: Record<string, React.ElementType> = {
  oss: SiGithub,
  engine: SiClaude,
  repo: RiGitRepositoryLine,
  dogfood: RiLoopRightLine,
};

const GRID_CONFIGS: Record<string, { squareSize: number; gridGap: number; maxOpacity: number; flickerChance: number }> = {
  oss:     { squareSize: 16, gridGap: 10, maxOpacity: 0.10, flickerChance: 0.08 },
  dogfood: { squareSize: 10, gridGap: 7,  maxOpacity: 0.14, flickerChance: 0.18 },
};

export function TrustBento() {
  return (
    <BentoGrid className="auto-rows-[18rem] gap-4 sm:gap-5">
      {trust.items.map((t) => (
        <BentoCard
          key={t.key}
          name={t.name}
          description={t.body}
          Icon={ICONS[t.key] ?? SiGithub}
          href={t.cta.href}
          cta={t.cta.label}
          className={t.span === 2 ? "col-span-3 lg:col-span-2" : "col-span-3 lg:col-span-1"}
          background={
            t.media ? (
              <div className="absolute inset-0">
                <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_42%,black_82%)]">
                  <SectionGrid {...GRID_CONFIGS[t.key]} />
                </div>
                <div className="relative p-5">
                  <MediaSlot label={mediaLabel(t.media)} className="h-24 w-full" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0" />
            )
          }
        />
      ))}
    </BentoGrid>
  );
}
