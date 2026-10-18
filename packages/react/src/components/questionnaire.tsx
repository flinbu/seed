import * as React from "react";
import { cn } from "../lib/cn.js";
import { ArrowLeftGlyph, ArrowRightGlyph, CheckGlyph, CircleAlertGlyph, PencilLineGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";
import { Input } from "./input.js";
import { Kbd } from "./kbd.js";

export interface QuestionChoice { value: string; label: React.ReactNode; description?: React.ReactNode }
export interface QuestionItem {
  name: string;
  prompt: string;
  description?: React.ReactNode;
  required?: boolean;
  multiple?: boolean;
  choices?: QuestionChoice[];
  /** Adds a free answer. */
  input?: { label?: string; placeholder?: string };
  errorMessage?: string;
}
export type QuestionAnswer = { choice?: string | null; choices?: string[]; text?: string };
export type QuestionAnswers = Record<string, QuestionAnswer>;

export interface QuestionnaireProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  items: QuestionItem[];
  onSubmit?: (answers: QuestionAnswers) => void;
  onCancel?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  defaultAnswers?: QuestionAnswers;
  /** Number keys 1 to 9 pick an answer. Default true. */
  shortcuts?: boolean;
}

const isEmpty = (a?: QuestionAnswer) => !a || (!a.choice && !a.text && !(a.choices && a.choices.length));

/** A few questions asked one at a time, for when Pluto needs a decision before it can help. */
export const Questionnaire = React.forwardRef<HTMLFormElement, QuestionnaireProps>(function Questionnaire(
  { items, onSubmit, onCancel, cancelLabel = "Not now", submitLabel = "Send answers", step, defaultStep = 0, onStepChange, defaultAnswers = {}, shortcuts = true, className, ...rest }, ref) {
  const [innerStep, setInnerStep] = React.useState(defaultStep);
  const i = Math.max(0, Math.min(step ?? innerStep, items.length - 1));
  const [answers, setAnswers] = React.useState<QuestionAnswers>(defaultAnswers);
  const [error, setError] = React.useState<string | null>(null);
  const id = React.useId();
  const fieldset = React.useRef<HTMLFieldSetElement>(null);
  const moved = React.useRef(false);
  const q = items[i]!;
  const a = answers[q.name];
  const chosen = q.multiple ? a?.choices ?? [] : a?.choice ?? null;
  const text = a?.text ?? "";
  const choices = q.choices ?? [];
  const last = i === items.length - 1;

  const set = (v: QuestionAnswer) => { setAnswers((prev) => ({ ...prev, [q.name]: v })); setError(null); };
  const go = (d: number) => { setError(null); moved.current = true; const n = i + d; if (step === undefined) setInnerStep(n); onStepChange?.(n); };
  const pick = (v: string) => {
    if (q.multiple) { const c = (chosen as string[]).includes(v) ? (chosen as string[]).filter((x) => x !== v) : [...(chosen as string[]), v]; set({ choices: c, text }); }
    else set({ choice: chosen === v ? null : v, text: "" });
  };
  const next = () => {
    if (q.required && isEmpty(a)) { setError(q.errorMessage ?? (q.multiple ? "Choose at least one answer to continue." : "Choose an answer to continue.")); return; }
    if (!last) go(1); else onSubmit?.(answers);
  };
  React.useEffect(() => { if (moved.current) fieldset.current?.focus(); }, [i]);
  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const t = e.target as HTMLElement & { type?: string };
    const choiceInput = t.tagName === "INPUT" && (t.type === "radio" || t.type === "checkbox");
    if (e.key === "Enter" && (t.tagName === "FIELDSET" || choiceInput)) { e.preventDefault(); next(); return; }
    if (!shortcuts || ((t.tagName === "INPUT" || t.tagName === "TEXTAREA") && !choiceInput)) return;
    const n = Number.parseInt(e.key, 10);
    if (n >= 1 && n <= choices.length && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); pick(choices[n - 1]!.value); }
  };
  const describedBy = [q.description ? `${id}-d` : "", error ? `${id}-e` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={ref} noValidate onKeyDown={onKeyDown} onSubmit={(e) => { e.preventDefault(); next(); }} className={cn("flex flex-col gap-base font-primary", className)} {...rest}>
      <div className="flex items-center justify-between gap-sm">
        <span className="text-tertiary uppercase tracking-widest mono-label-medium">Question {i + 1} of {items.length}</span>
        <span aria-hidden="true" className="inline-flex gap-xxs">
          {items.map((_, k) => (
            <span key={k} className={cn("h-(--space-xxs) rounded-full transition-[width,background-color] duration-(--duration-base) motion-reduce:transition-none",
              k === i ? "w-(--space-lg) bg-accent-solid" : k < i ? "w-(--space-xs) bg-(--color-icon-tertiary)" : "w-(--space-xs) bg-(--border-primary)")} />
          ))}
        </span>
      </div>
      <fieldset key={q.name} ref={fieldset} tabIndex={-1} aria-invalid={error ? true : undefined} aria-describedby={describedBy}
        className="m-0 flex min-w-0 flex-col gap-xs border-0 p-0 outline-0 motion-safe:animate-seed-rise">
        <legend className="p-0 text-primary heading-h6-semibold">
          {q.prompt}{q.required ? null : <span className="font-normal text-tertiary body-body-4-regular"> Optional</span>}
        </legend>
        {q.description ? <p id={`${id}-d`} className="m-0 text-secondary body-body-3-regular">{q.description}</p> : null}
        <div role={q.multiple ? "group" : "radiogroup"} aria-label={q.prompt} className="mt-xxs flex flex-col gap-xxs">
          {choices.map((c, k) => {
            const on = q.multiple ? (chosen as string[]).includes(c.value) : chosen === c.value;
            const cid = `${id}-c${k}`;
            return (
              <label key={c.value} htmlFor={cid}
                className={cn("flex min-h-(--size-4xl) cursor-pointer items-center gap-sm rounded-md border px-sm py-xs transition-colors duration-(--duration-fast) has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-primary motion-reduce:transition-none",
                  on ? "border-accent-primary bg-selected" : cn("bg-primary hover:border-primary hover:bg-primary-hover", error ? "border-error-primary" : "border-secondary"))}>
                <input id={cid} type={q.multiple ? "checkbox" : "radio"} name={`${id}-${q.name}`} checked={on} onChange={() => pick(c.value)} className="sr-only" />
                {shortcuts ? <Kbd aria-hidden="true">{k + 1}</Kbd> : null}
                <span className="flex min-w-0 flex-1 flex-col gap-xxxs text-primary">
                  <span className="label-label-2-medium">{c.label}</span>
                  {c.description ? <span className="text-secondary body-body-4-regular">{c.description}</span> : null}
                </span>
                <span aria-hidden="true" className="inline-flex w-(--size-lg) leading-none text-icon-accent-primary">{on ? <CheckGlyph size={16} /> : null}</span>
              </label>
            );
          })}
          {q.input ? (
            <Input aria-label={q.input.label ?? "Another answer"} placeholder={q.input.placeholder ?? "Another answer…"} value={text} leftIcon={<PencilLineGlyph />}
              onChange={(e) => { const v = e.target.value; set(q.multiple ? { choices: chosen as string[], text: v } : { choice: v ? null : (chosen as string | null), text: v }); }} />
          ) : null}
        </div>
        {error ? <p id={`${id}-e`} role="alert" className="m-0 flex items-center gap-xxs text-error-primary body-body-3-regular"><CircleAlertGlyph size={16} />{error}</p> : null}
      </fieldset>
      <div className="flex items-center justify-between gap-xs border-t border-tertiary pt-xs">
        {i > 0 ? <Button type="button" variant="ghost" leftIcon={<ArrowLeftGlyph />} onClick={() => go(-1)}>Back</Button>
          : onCancel ? <Button type="button" variant="ghost" onClick={onCancel}>{cancelLabel}</Button> : <span />}
        <span className="inline-flex gap-xs">
          {!q.required && !last ? <Button type="button" variant="ghost" onClick={() => go(1)}>Skip</Button> : null}
          <Button type="submit" rightIcon={last ? undefined : <ArrowRightGlyph />}>{last ? submitLabel : "Next"}</Button>
        </span>
      </div>
    </form>
  );
});
