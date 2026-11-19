// iKAN alert emails, sent through the ikanhealth.in mailbox on Hostinger (SMTP, port 465).
//
// Settings: host, port, sender and recipients are not secret, so they live in DEFAULTS below and
// a Supabase secret of the same name overrides them. The one real secret is SMTP_PASS, the
// mailbox password, which only the owner sets (Supabase → Edge Functions → Secrets).
//
// Stage 1: POST { "test": true } sends one test email to ALERT_TO. Nothing else is accepted yet;
// the table triggers (contact, pilot lead, newsletter, partner application, new user) come next.
// The recipients are fixed by the function, so a caller cannot use it to mail anyone else.
import nodemailer from "npm:nodemailer@6.9.16";

const DEFAULTS: Record<string, string> = {
  SMTP_HOST: "smtp.hostinger.com",
  SMTP_PORT: "465",
  SMTP_USER: "support@ikanhealth.in",
  ALERT_TO: "vedanshu@wugweb.com, kartikchaturvedi91@gmail.com",
};
const env = (k: string) => Deno.env.get(k) || DEFAULTS[k] || "";
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const body = await req.json().catch(() => ({}));
  if (body?.test !== true) return json({ error: "Only { test: true } is supported so far" }, 400);

  const missing = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "ALERT_TO"].filter((k) => !env(k));
  if (missing.length) return json({ sent: false, missing }, 412);

  const port = Number(env("SMTP_PORT"));
  const transport = nodemailer.createTransport({
    host: env("SMTP_HOST"),
    port,
    secure: port === 465,
    auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") },
  });

  try {
    const at = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const info = await transport.sendMail({
      from: `iKAN <${env("SMTP_USER")}>`,
      to: env("ALERT_TO"),
      subject: "iKAN alerts: test email",
      text: `This is a test from iKAN's alert function, sent ${at} IST through ${env("SMTP_HOST")} as ${env("SMTP_USER")}.\n\nIf you can read this, Supabase can email you about new leads, contact messages, newsletter sign-ups, partner applications and new users.`,
    });
    return json({ sent: true, messageId: info.messageId, accepted: info.accepted, response: info.response });
  } catch (e) {
    return json({ sent: false, error: e instanceof Error ? e.message : String(e) }, 502);
  }
});
