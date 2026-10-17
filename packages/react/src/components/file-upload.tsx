import * as React from "react";
import { cn } from "../lib/cn.js";
import { FileGlyph, UploadGlyph, XGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";
import { Progress } from "./progress.js";
import { useField } from "./field.js";

export interface UploadFile { id: string; name: string; size: number; type?: string; file?: File; progress?: number; error?: string }
export interface FileUploadProps {
  files?: UploadFile[];
  defaultFiles?: UploadFile[];
  /** New files arrive with error set when they fail accept or maxSize. Set progress yourself while uploading. */
  onFilesChange?: (files: UploadFile[]) => void;
  onRemove?: (file: UploadFile) => void;
  /** Same syntax as <input accept>: ".json,image/*". */
  accept?: string;
  /** Bytes. */
  maxSize?: number;
  /** Default true. */
  multiple?: boolean;
  title?: React.ReactNode;
  hint?: React.ReactNode;
  buttonLabel?: string;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const formatBytes = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(b < 10240 ? 1 : 0)} KB` : `${(b / 1048576).toFixed(1)} MB`);
function accepted(f: File, accept?: string) {
  if (!accept) return true;
  return accept.split(",").some((raw) => {
    const a = raw.trim().toLowerCase();
    if (!a) return false;
    if (a.startsWith(".")) return f.name.toLowerCase().endsWith(a);
    if (a.endsWith("/*")) return (f.type || "").toLowerCase().startsWith(a.slice(0, -1));
    return (f.type || "").toLowerCase() === a;
  });
}
let seq = 0;

/** Drop files or browse for them. Checks type and size before anything uploads. */
export function FileUpload({ files, defaultFiles = [], onFilesChange, onRemove, accept, maxSize, multiple = true, title = "Drag files here or browse", hint, buttonLabel = "Browse files", invalid, disabled, id, className }: FileUploadProps) {
  const f = useField();
  const [inner, setInner] = React.useState(defaultFiles);
  const list = files ?? inner;
  const set = (n: UploadFile[]) => { if (files === undefined) setInner(n); onFilesChange?.(n); };
  const [drag, setDrag] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);
  const off = disabled ?? f?.disabled, bad = invalid ?? f?.invalid;
  function add(fl: FileList) {
    const next = Array.from(fl).map((file) => ({
      id: `f${++seq}`, name: file.name, size: file.size, type: file.type, file,
      error: !accepted(file, accept) ? "This file type isn't allowed." : maxSize && file.size > maxSize ? `Larger than ${formatBytes(maxSize)}.` : undefined,
    }));
    set(multiple ? [...list, ...next] : next.slice(0, 1));
  }
  return (
    <div className={cn("flex min-w-0 flex-col gap-sm font-primary", className)}>
      <div onDragOver={(e) => { if (off) return; e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { if (off) return; e.preventDefault(); setDrag(false); if (e.dataTransfer.files.length) add(e.dataTransfer.files); }}
        className={cn("flex flex-col items-center gap-xs rounded-petal rounded-tl-petal-tip border border-dashed border-primary bg-secondary px-lg py-xl text-center transition-colors duration-(--duration-fast)",
          drag && "border-accent-primary bg-accent-primary", bad && "border-error-primary", off && "border-disabled-alt bg-disabled-alt")}>
        <UploadGlyph size={20} className={off ? "text-icon-disabled" : "text-icon-secondary"} />
        <p className={cn("m-0 label-label-2-medium", off ? "text-disabled" : "text-primary")}>{title}</p>
        {hint ? <p className="m-0 text-tertiary body-body-4-regular">{hint}</p> : null}
        <Button variant="secondary" size="sm" disabled={off} onClick={() => input.current?.click()} aria-describedby={f?.describedBy} className="mt-xxs">{buttonLabel}</Button>
        <input ref={input} id={id ?? f?.id} type="file" className="sr-only" tabIndex={-1} accept={accept} multiple={multiple} disabled={off}
          onChange={(e) => { if (e.target.files?.length) add(e.target.files); e.target.value = ""; }} />
      </div>
      {list.length ? (
        <ul aria-label="Files" className="m-0 flex list-none flex-col gap-xs p-0">
          {list.map((file) => {
            const done = file.progress == null || file.progress >= 100;
            return (
              <li key={file.id} className={cn("flex items-center gap-sm rounded-lg border border-secondary bg-primary p-sm", file.error && "border-error-secondary bg-error-primary")}>
                <FileGlyph size={20} className={file.error ? "text-icon-error-primary" : "text-icon-secondary"} />
                <div className="flex min-w-0 flex-1 flex-col gap-xxs">
                  <div className="flex items-baseline justify-between gap-sm">
                    <span className="truncate text-primary label-label-2-medium">{file.name}</span>
                    {file.error ? null : <span className="shrink-0 text-tertiary tabular-nums body-body-4-regular">{done ? formatBytes(file.size) : `${Math.round(file.progress!)}%`}</span>}
                  </div>
                  {file.error ? <span className="text-error-primary body-body-4-medium">{file.error}</span>
                    : !done ? <Progress value={file.progress} size="sm" aria-label={`Uploading ${file.name}`} /> : null}
                </div>
                <Button variant="ghost" size="sm" icon={<XGlyph />} aria-label={`Remove ${file.name}`} onClick={() => { set(list.filter((x) => x.id !== file.id)); onRemove?.(file); }} />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
