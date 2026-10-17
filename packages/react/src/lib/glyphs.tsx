import * as React from "react";

/* The few Lucide shapes Seed's own components draw, inline so lucide-react stays optional. */
const glyph = (d: React.ReactNode) => function Glyph({ size = 16, className }: { size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>{d}</svg>;
};
export const CheckGlyph = glyph(<path d="M20 6 9 17l-5-5" />);
export const ChevronDownGlyph = glyph(<path d="m6 9 6 6 6-6" />);
export const ChevronUpGlyph = glyph(<path d="m18 15-6-6-6 6" />);
export const ChevronRightGlyph = glyph(<path d="m9 18 6-6-6-6" />);
export const ChevronsUpDownGlyph = glyph(<><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></>);
export const DotGlyph = glyph(<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />);
export const XGlyph = glyph(<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>);
export const ArrowUpGlyph = glyph(<><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></>);
export const ArrowDownGlyph = glyph(<><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></>);
export const ChevronLeftGlyph = glyph(<path d="m15 18-6-6 6-6" />);
export const CalendarGlyph = glyph(<><path d="M8 2v4M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>);
export const SearchGlyph = glyph(<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>);
export const UploadGlyph = glyph(<><path d="M12 13v8" /><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" /><path d="m8 17 4-4 4 4" /></>);
export const FileGlyph = glyph(<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></>);
export const FolderGlyph = glyph(<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />);
export const FolderOpenGlyph = glyph(<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />);
export const CopyGlyph = glyph(<><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>);
export const EyeGlyph = glyph(<><path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" /><circle cx="12" cy="12" r="3" /></>);
export const EyeOffGlyph = glyph(<><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c4.36 0 8.03 2.8 9.94 6.65a1 1 0 0 1 0 .7 10.8 10.8 0 0 1-1.44 2.49" /><path d="M14.08 14.16a3 3 0 0 1-4.24-4.24" /><path d="M17.48 17.5A10.75 10.75 0 0 1 2.06 12.35a1 1 0 0 1 0-.7 10.8 10.8 0 0 1 4.45-5.14" /><path d="m2 2 20 20" /></>);
export const ArrowUpRightGlyph = glyph(<><path d="M7 7h10v10" /><path d="M7 17 17 7" /></>);
export const ArrowLeftGlyph = glyph(<><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></>);
