/* Shared by Alert and Banner: how a status message shows its tone and how it is announced. */

export type MessageTone = "neutral" | "info" | "success" | "warning" | "error" | "offer";
/** subtle: a neutral surface where only the icon carries the tone. loud: the same surface with a hairline in the tone. */
export type Emphasis = "subtle" | "loud";

/** The 1px border of a loud message. Subtle messages use the neutral card hairline (border-secondary). */
export const LOUD_BORDER: Record<MessageTone, string> = {
  neutral: "border-primary",
  info: "border-info-subtle",
  success: "border-success-subtle",
  warning: "border-warning-subtle",
  error: "border-error-subtle",
  offer: "border-offer-subtle",
};

/** Read before the message so its tone never depends on color alone. Neutral and offer messages have none. */
export const TONE_LABEL: Partial<Record<MessageTone, string>> = { info: "Info", success: "Success", warning: "Warning", error: "Error" };

/** A message rendered with the page gets no live role; one that appears later is a status, or an alert for errors. */
export function liveRole(tone: string, live: boolean | undefined): "alert" | "status" | undefined {
  if (!live) return undefined;
  return tone === "error" ? "alert" : "status";
}
