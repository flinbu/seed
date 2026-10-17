"use client";
import * as React from "react";
import { Button } from "@flinbu/seed";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text, label = "Copy code" }: { text: string; label?: string }) {
  const [done, setDone] = React.useState(false);
  return (
    <Button variant="ghost" size="sm" icon={done ? Check : Copy} aria-label={done ? "Copied" : label}
      onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }} />
  );
}
