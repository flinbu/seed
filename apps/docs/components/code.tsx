import { highlight } from "@/lib/highlight";
import { CopyButton } from "./copy-button";
import { cn } from "@flinbu/seed";

/** A highlighted code block with a copy button. Server component. */
export async function Code({ code, lang = "tsx", title, className }: { code: string; lang?: string; title?: string; className?: string }) {
  const html = await highlight(code, lang);
  return (
    <div className={cn("group relative overflow-hidden rounded-xl border border-secondary bg-inset", className)}>
      {title ? <div className="flex h-control-md items-center justify-between border-b border-secondary px-base mono-label-medium text-tertiary">{title}<CopyButton text={code.trim()} /></div> : null}
      {title ? null : <div className="absolute right-xs top-xs opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"><CopyButton text={code.trim()} /></div>}
      <div className="overflow-x-auto p-base font-mono text-[length:var(--text-sm)] leading-6 [&_pre]:m-0" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
