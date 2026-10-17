"use client";
import { Button } from "@flinbu/seed";
import { Plus, Search, ArrowRight, Trash2 } from "lucide-react";

export function Variants() {
  return (
    <>
      <Button>Save changes</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="tertiary">Duplicate</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="destructive" leftIcon={<Trash2 />}>Delete token</Button>
      <Button variant="success">Approve</Button>
      <Button variant="link">Read the guide</Button>
    </>
  );
}

export function Sizes() {
  return (
    <>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </>
  );
}

export function Icons() {
  return (
    <>
      <Button leftIcon={<Plus />}>New token</Button>
      <Button variant="secondary" rightIcon={<ArrowRight />}>Continue</Button>
      <Button variant="ghost" icon={<Search />} aria-label="Search" />
    </>
  );
}

export function States() {
  return (
    <>
      <Button loading>Saving</Button>
      <Button disabled>Disabled</Button>
      <Button variant="secondary" disabled>Disabled</Button>
    </>
  );
}
