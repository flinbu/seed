import Link from "next/link";
import { Alert, Avatar, Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, Field, Input, Progress, Switch } from "@flinbu/seed";
import { ArrowRight, Palette, Search, ShieldCheck, Wind } from "lucide-react";
import { Code } from "@/components/code";

const FEATURES = [
  { icon: Wind, title: "Tokens are Tailwind classes", body: "bg-primary, text-secondary, p-base, rounded-control. The same names in your code, Figma and the docs." },
  { icon: Palette, title: "Theme it in one command", body: "npx seed theme --brand your color builds a full scale, Light and Dark, and checks every accent against WCAG AA." },
  { icon: ShieldCheck, title: "Accessible by default", body: "Interactive parts sit on Radix: keyboard, focus and screen readers handled. Every component is tested with axe." },
];

export default function Home() {
  return (
    <main id="content">
      <section className="stage border-b border-secondary">
        <div className="mx-auto grid max-w-screen-xl grid-cols-[minmax(0,1fr)] items-center gap-3xl px-lg py-4xl lg:py-6xl lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div className="flex min-w-0 flex-col gap-lg">
            <Badge variant="accent" className="self-start">Early version · MIT</Badge>
            <h1 className="m-0 title-title-3-regular text-primary text-balance max-md:text-[40px] max-md:leading-[1.1]">A calm design system for React and Tailwind.</h1>
            <p className="m-0 max-w-xl reading-body-light text-secondary">Seed is neutral-first: true-gray surfaces, one accent you can make your own, and contrast that passes AA in Light and Dark. Use its components, or just its tokens.</p>
            <div className="flex flex-wrap gap-xs">
              <Button size="lg" href="/docs/getting-started" rightIcon={<ArrowRight />}>Get started</Button>
              <Button size="lg" variant="secondary" href="/docs/theming" leftIcon={<Palette />}>Make it yours</Button>
            </div>
            <Code code={"npm i @flinbu/seed @flinbu/seed-tokens lucide-react"} lang="bash" className="max-w-xl" />
          </div>
          <Card className="shadow-elevation-lg">
            <CardHeader><CardTitle>Invite your team</CardTitle><CardDescription>Editors propose changes; viewers are free.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-base">
              <Field label="Email" hint="They get a link that works for 7 days."><Input leftIcon={<Search />} placeholder="name@company.com" /></Field>
              <div className="flex flex-wrap gap-base"><Checkbox label="Can approve" defaultChecked /><Switch label="Weekly digest" /></div>
              <div className="flex items-center gap-xs"><Avatar size="sm" name="Ana Ruiz" /><Avatar size="sm" name="Tomás Gil" /><Avatar size="sm" name="Felipe Linares" /><Badge variant="success" dot>3 active</Badge></div>
              <Progress value={60} label="Seats" showValue size="sm" />
              <Alert variant="success" title="Invites sent">They’ll show up here once they join.</Alert>
            </CardContent>
            <CardFooter><Button variant="secondary" size="sm">Cancel</Button><Button size="sm">Send invites</Button></CardFooter>
          </Card>
        </div>
      </section>
      <section className="mx-auto grid max-w-screen-xl gap-base px-lg py-4xl md:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col gap-xs">
            <span className="inline-flex size-(--size-4xl) items-center justify-center rounded-lg bg-accent-primary text-icon-accent-primary"><f.icon size={20} aria-hidden /></span>
            <h2 className="m-0 label-label-1-semibold text-primary">{f.title}</h2>
            <p className="m-0 reading-small-light text-secondary">{f.body}</p>
          </div>
        ))}
      </section>
      <footer className="border-t border-secondary px-lg py-lg text-center body-body-4-regular text-tertiary">
        MIT © Felipe Linares · <Link href="https://github.com/flinbu/seed" className="text-link">GitHub</Link>
      </footer>
    </main>
  );
}
