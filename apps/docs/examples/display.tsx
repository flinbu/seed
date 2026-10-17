"use client";
import { Badge, Avatar, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Kbd, Separator, Icon, Spinner, Skeleton } from "@flinbu/seed";
import { Check, GitPullRequest, Palette, Search, Orbit } from "lucide-react";

export function BadgeVariants() {
  return (
    <div className="flex flex-col gap-sm">
      <div className="flex flex-wrap gap-xs">
        <Badge>Draft</Badge>
        <Badge variant="accent">New</Badge>
        <Badge variant="success" icon={<Check />}>Passes AA</Badge>
        <Badge variant="warning">Review</Badge>
        <Badge variant="error">2 errors</Badge>
        <Badge variant="info" icon={<GitPullRequest />}>cs_204</Badge>
        <Badge variant="offer">Pro</Badge>
      </div>
      <div className="flex flex-wrap gap-xs">
        <Badge appearance="solid">Neutral</Badge>
        <Badge variant="accent" appearance="solid">Accent</Badge>
        <Badge variant="success" appearance="outline" dot>Live</Badge>
        <Badge variant="error" appearance="outline" dot>Failing</Badge>
      </div>
    </div>
  );
}

export function AvatarSizes() {
  return (
    <>
      <Avatar size="xs" name="Ana Ruiz" />
      <Avatar size="sm" name="Tomás Gil" />
      <Avatar name="Felipe Linares" />
      <Avatar size="lg" name="Seed" shape="square" />
    </>
  );
}

export function CardBasic() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Tokens</CardTitle>
        <CardDescription>435 tokens in Light and Dark.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="m-0 body-body-3-regular text-secondary">4 text colors fail contrast in Light since the last sync.</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm">Later</Button>
        <Button size="sm" leftIcon={<Palette />}>Open tokens</Button>
      </CardFooter>
    </Card>
  );
}

export function KbdBasic() {
  return (
    <span className="inline-flex items-center gap-xxs body-body-3-regular text-secondary">
      Search with <Kbd>⌘</Kbd><Kbd>K</Kbd>
    </span>
  );
}

export function SeparatorBasic() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-sm">
      <span className="body-body-3-regular text-secondary">Above</span>
      <Separator />
      <div className="flex h-(--size-xl) items-center gap-sm body-body-3-regular text-secondary">
        Tokens <Separator orientation="vertical" /> Components <Separator orientation="vertical" /> Docs
      </div>
    </div>
  );
}

export function IconSizes() {
  return (
    <>
      <Icon as={Search} size="xs" />
      <Icon as={Search} size="sm" />
      <Icon as={Search} size="md" />
      <Icon as={Orbit} size="lg" label="Pluto" className="text-icon-accent-primary" />
    </>
  );
}

export function SpinnerBasic() {
  return (
    <>
      <Spinner size="xs" />
      <Spinner />
      <Spinner size="md" className="text-icon-accent-primary" />
    </>
  );
}

export function SkeletonBasic() {
  return (
    <div className="flex w-full max-w-sm items-center gap-sm" aria-busy="true">
      <Skeleton shape="circle" width={40} height={40} />
      <div className="flex flex-1 flex-col gap-xs">
        <Skeleton shape="text" width="60%" />
        <Skeleton shape="text" width="90%" />
      </div>
    </div>
  );
}
