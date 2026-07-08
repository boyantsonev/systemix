import { DocsPage, DocsBody, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { designSource } from "@/lib/design-source";
import { getMDXComponents } from "@/mdx-components";

// The design/ spine pages: DESIGN.md, guardrails, tokens.
export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await props.params;
  const page = designSource.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  // The root index.mdx (slug: []) is served by ../page.tsx, not this catch-all.
  return designSource.generateParams().filter((p) => p.slug.length > 0);
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await props.params;
  const page = designSource.getPage(slug);
  if (!page) notFound();
  return { title: page.data.title };
}
