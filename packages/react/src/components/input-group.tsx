import * as React from "react";
import { cn } from "../lib/cn.js";
import { fieldFrame } from "./input.js";
import { useField } from "./field.js";

const SIZE = { sm: "h-control-sm px-xs body-body-3-regular", md: "h-control-md px-sm body-body-3-regular", lg: "h-control-lg px-base body-body-2-regular" } as const;
const addon = (x: React.ReactNode) => (x == null || x === false ? null
  : typeof x === "string" || typeof x === "number" ? <span className="whitespace-nowrap text-tertiary select-none">{x}</span>
  : <span className="inline-flex items-center gap-xxs leading-none text-icon-tertiary">{x}</span>);

interface Shared { size?: "sm" | "md" | "lg"; invalid?: boolean; start?: React.ReactNode; end?: React.ReactNode; className?: string }
export interface InputGroupProps extends Shared, Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> { multiline?: false }
export interface InputGroupTextareaProps extends Shared, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  multiline: true;
  /** A bar above the text: mode pickers, attached files. */
  top?: React.ReactNode;
  /** A bar below: actions on the left, Send on the right. */
  bottom?: React.ReactNode;
}

/**
 * The Input shell with add-ons: text ("https://", "px"), icons, small Buttons and Kbd inside. With multiline, it becomes a
 * prompt box with toolbars above and below.
 */
export const InputGroup = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputGroupProps | InputGroupTextareaProps>(function InputGroup(props, ref) {
  const f = useField();
  const { size = "md", invalid, start, end, className, disabled, id, ...rest } = props as any;
  const bad = invalid ?? f?.invalid, off = disabled ?? f?.disabled;
  const shared = { id: id ?? f?.id, disabled: off, "aria-invalid": bad || undefined, "aria-describedby": f?.describedBy, required: (rest as any).required ?? f?.required };
  const frame = cn(fieldFrame, "focus-within:border-accent-primary focus-within:shadow-button-focus-primary",
    bad && "border-error-primary hover:border-error-primary focus-within:border-error-primary focus-within:shadow-button-focus-destructive",
    off && "border-disabled-alt bg-disabled-alt text-disabled shadow-none hover:border-disabled-alt", className);
  if (props.multiline) {
    const { top, bottom, multiline, rows = 3, ...ta } = rest as any;
    return (
      <div className={cn("flex flex-col px-sm py-xs", frame)}>
        {top ? <div className="mb-xxs flex items-center gap-xs border-b border-secondary pb-xs">{top}</div> : null}
        <div className="flex items-start gap-xs">
          {addon(start)}
          <textarea ref={ref as React.Ref<HTMLTextAreaElement>} rows={rows} {...shared} {...ta}
            className="min-h-control-md min-w-0 flex-1 resize-none border-0 bg-transparent px-0 py-xxs font-primary text-inherit outline-none placeholder:text-placeholder body-body-3-regular" />
          {addon(end)}
        </div>
        {bottom ? <div className="flex items-center justify-between gap-xs pt-xs">{bottom}</div> : null}
      </div>
    );
  }
  const { multiline, ...inp } = rest as any;
  return (
    <div className={cn("flex items-center gap-xs", SIZE[size as "sm" | "md" | "lg"], frame)}>
      {addon(start)}
      <input ref={ref as React.Ref<HTMLInputElement>} {...shared} {...inp}
        className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-primary text-inherit outline-none placeholder:text-placeholder disabled:cursor-not-allowed [font-size:inherit] [line-height:inherit] [font-weight:inherit]" />
      {addon(end)}
    </div>
  );
});
