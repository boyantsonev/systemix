import { DocsPage, DocsBody, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { designSource } from "@/lib/design-source";
import { getMDXComponents } from "@/mdx-components";

// The root design page renders design/index.mdx — the instance spine overview.
export default function DesignIndex() {
  const page = designSource.getPage([]);
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
