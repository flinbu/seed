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
