import { Sidebar } from "@/components/sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-screen-xl gap-2xl px-lg">
      <aside className="sticky top-(--space-5xl) hidden h-[calc(100dvh-var(--space-5xl))] w-60 shrink-0 overflow-y-auto py-xl lg:block"><Sidebar /></aside>
      <main id="content" className="min-w-0 flex-1 py-2xl pb-6xl">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
