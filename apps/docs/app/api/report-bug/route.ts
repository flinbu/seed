/*
 * Report a bug from the Seed docs: no account needed. Posts to Fenly's Slack #bugs with the labelled lines the
 * evening task reads to log it in Notion (Product: Seed, Source: Seed docs). Slack is the only integration.
 * Server only: SLACK_BOT_TOKEN never reaches the browser. Designed on the "Report a bug" canvas (board B).
 */
export const runtime = "nodejs";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const quote = (s: string) => escape(s.trim()).split("\n").map((l) => `> ${l}`).join("\n");
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// A few reports an hour per address is plenty. Per server instance, which is enough against a stuck button.
const seen = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (seen.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  if (recent.length >= 5) return true;
  seen.set(ip, [...recent, now]);
  return false;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Check the form." }, { status: 400 });
  }
  // A field people never see: bots fill it in. Answer as if it worked.
  if (str(body.website, 200)) return Response.json({ ok: true });
  const what = str(body.what, 4000);
  const expected = str(body.expected, 2000);
  const email = str(body.email, 200);
  const component = str(body.component, 80);
  const page = str(body.page, 300);
  const browser = str(body.browser, 120);
  if (what.length < 3) return Response.json({ error: "Tell us what happened." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return Response.json({ error: "That email doesn't look right." }, { status: 400 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooMany(ip)) return Response.json({ error: "That's a lot of reports. Try again a bit later." }, { status: 429 });

  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) return Response.json({ error: "Reporting isn't set up here yet." }, { status: 503 });
  const text = [
    ":beetle: *Bug report* from Seed docs",
    "*Product:* Seed",
    "*Source:* Seed docs",
    `*Reporter:* ${email ? escape(email) : "Someone on the Seed docs"}`,
    ...(email ? [`*Email:* ${escape(email)}`] : []),
    "*Severity:* Not sure",
    "*What happened:*",
    quote(what),
    ...(expected ? ["*Expected:*", quote(expected)] : []),
    "*Context*",
    ...(component ? [`• Component: ${escape(component)}`] : []),
    `• Seed: ${process.env.NEXT_PUBLIC_SEED_VERSION ?? "unknown"}`,
    ...(page ? [`• Page: ${escape(page)}`] : []),
    ...(browser ? [`• Browser: ${escape(browser)}`] : []),
  ].join("\n");
  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ channel: process.env.SLACK_BUGS_CHANNEL || "C0CCN802TEU", text, unfurl_links: false }),
  });
  const json = (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; error?: string };
  if (!json.ok) {
    console.error("Slack chat.postMessage:", json.error);
    return Response.json({ error: "We couldn't send it just now. Try again in a moment." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
