---
"@flinbu/seed-tokens": minor
"@flinbu/seed": minor
---

Alerts and banners are calmer. Both now sit on the page's own surface (`bg-primary`) with the neutral card hairline, and only the icon carries the tone, so every existing `<Alert>` and `<Banner>` turns quiet with no code changes. The saturated tinted fills and strong borders are gone. When one alert really has to stand out, use the new `emphasis="loud"`: the same surface with a 1px hairline in the tone, from the new `border-info-subtle`, `border-success-subtle`, `border-warning-subtle`, `border-error-subtle` and `border-offer-subtle` tokens (the -300 step in Light, the -400 step at 40% over `bg-primary` in Dark). Announcements change too: an alert or banner rendered with the page has no live role, and one that appears later takes the new `live` prop to become `role="status"`, or `role="alert"` for errors only, so warnings no longer interrupt. Every alert and banner reads a visually hidden "Info:", "Success:", "Warning:" or "Error:" first (translate it with `toneLabel`), and links inside them use `text-accent-primary`.
