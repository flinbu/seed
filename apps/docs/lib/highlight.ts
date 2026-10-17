import { codeToHtml } from "shiki";

/** Highlighted HTML with both light and dark colors as CSS variables. */
export async function highlight(code: string, lang = "tsx"): Promise<string> {
  return codeToHtml(code.trim(), { lang, themes: { light: "github-light", dark: "github-dark" }, defaultColor: false });
}
