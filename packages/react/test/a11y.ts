import axe from "axe-core";
/** Runs axe on a rendered tree. Color contrast is checked against real CSS in the tokens tests, not in jsdom. */
export async function violations(el: Element) {
  const r = await axe.run(el, { rules: { "color-contrast": { enabled: false }, region: { enabled: false } } });
  return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}
