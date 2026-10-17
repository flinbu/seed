import type { MDXComponents } from "mdx/types";
import { Code } from "@/components/code";

/* Docs typography: Domine for page titles, Plus Jakarta for headings, Noto Serif for reading text. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (p) => <h1 className="m-0 mb-base display-title-regular text-primary text-balance" {...p} />,
    h2: (p) => <h2 className="mt-3xl mb-sm heading-h6-semibold text-primary scroll-mt-(--space-6xl)" {...p} />,
    h3: (p) => <h3 className="mt-xl mb-xs label-label-1-semibold text-primary" {...p} />,
    p: (p) => <p className="my-sm reading-body-light text-secondary" {...p} />,
    a: (p) => <a className="text-link underline underline-offset-3 hover:text-link-hover" {...p} />,
    ul: (p) => <ul className="my-sm flex list-disc flex-col gap-xxs pl-lg reading-body-light text-secondary marker:text-tertiary" {...p} />,
    ol: (p) => <ol className="my-sm flex list-decimal flex-col gap-xxs pl-lg reading-body-light text-secondary marker:text-tertiary" {...p} />,
    strong: (p) => <strong className="font-medium text-primary" {...p} />,
    table: (p) => <div className="my-base overflow-x-auto rounded-petal rounded-tl-petal-tip border border-secondary"><table className="w-full border-collapse body-body-3-regular" {...p} /></div>,
    th: (p) => <th className="border-b border-secondary bg-secondary px-sm py-xs text-left mono-label-medium text-tertiary" {...p} />,
    td: (p) => <td className="border-b border-secondary px-sm py-xs align-top text-secondary [&_code]:whitespace-nowrap" {...p} />,
    blockquote: (p) => <blockquote className="my-base rounded-petal rounded-tl-petal-tip border border-info-secondary bg-info-primary px-base py-sm [&_p]:my-0" {...p} />,
    code: (p) => <code className="rounded-sm bg-tertiary px-xxs py-px font-mono text-primary text-[0.9em]" {...p} />,
    pre: (p: any) => {
      const child = p.children?.props;
      const lang = /language-(\w+)/.exec(child?.className ?? "")?.[1] ?? "tsx";
      return <Code code={String(child?.children ?? "")} lang={lang} className="my-base" />;
    },
    ...components,
  };
}
