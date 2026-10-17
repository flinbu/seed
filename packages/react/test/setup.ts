import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(() => cleanup());
// jsdom lacks these; Radix measures controls with them.
class RO { observe() {} unobserve() {} disconnect() {} }
(globalThis as any).ResizeObserver ??= RO;
(window as any).matchMedia ??= (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false });
(Element.prototype as any).hasPointerCapture ??= () => false;
(Element.prototype as any).scrollIntoView ??= () => {};
