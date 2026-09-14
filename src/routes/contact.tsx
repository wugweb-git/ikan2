import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Mail, Phone, ShieldAlert } from "lucide-react";
import { InfoShell } from "@/components/info-shell";
import { Illustration } from "@/components/art";
import { pageMeta } from "@/components/equip/program-header";
import { Field, FormError, PrimaryButton } from "@/components/auth-ui";
import { useAuth, SUPABASE_ANON_KEY, SUPABASE_URL, displayName } from "@/lib/auth";
import { contactPage as c } from "@/lib/content";

export const Route = createFileRoute("/contact")({
  head: () => pageMeta("Contact us", c.heroSubtitle),
  component: ContactPage,
});

function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState(displayName(user));
  const [email, setEmail] = useState(user?.email ?? "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()) || !message.trim()) {
      setError("Add your name, a valid email and a message.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/make-server-cc205da9/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || "General enquiry",
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Your message didn’t send.");
      setSent(true);
    } catch {
      setError(
        "Your message didn’t send. Check your connection and try again, or email us directly.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <InfoShell>
      <header className="px-5">
        <h1 className="font-display text-[32px] font-semibold leading-10">{c.heroTitle}</h1>
        <p className="mt-2 text-[16px] leading-6 text-muted-foreground">{c.heroSubtitle}</p>
      </header>

      <section className="mx-5 mt-6 overflow-hidden rounded-[24px] bg-[#F9DEDC] text-[#5A1410]">
        <div className="flex gap-3 p-5">
          <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0" />
          <div>
            <p className="font-display text-[18px] font-semibold">{c.crisisCard.title}</p>
            <p className="mt-1 text-[14px] leading-5">{c.crisisCard.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.crisisCard.buttons.map((b) => (
                <a
                  key={b.label}
                  href={b.action}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-[#5A1410] px-4 text-[14px] font-semibold text-white"
                >
                  <Phone className="h-4 w-4" /> {b.label}
                </a>
              ))}
              <Link
                to="/support"
                className="inline-flex h-10 items-center rounded-full border border-[#5A1410]/30 px-4 text-[14px] font-semibold"
              >
                More helplines
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ul className="mx-5 mt-3 grid grid-cols-2 gap-3">
        {c.contactMethods.map((m) => (
          <li key={m.title}>
            <a href={m.action} className="block h-full rounded-[20px] bg-secondary p-4">
              {m.icon === "phone" ? <Phone className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
              <p className="mt-3 text-[15px] font-semibold">{m.title}</p>
              <p className="mt-0.5 text-[12px] leading-4 text-muted-foreground">{m.description}</p>
              <p className="mt-2 break-all text-[13px] font-semibold">{m.value}</p>
            </a>
          </li>
        ))}
      </ul>

      <section className="mx-5 mt-8">
        <h2 className="font-display text-[20px] font-semibold">{c.formTitle}</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">{c.formSubtitle}</p>
        {sent ? (
          <div className="mt-4 overflow-hidden rounded-[24px] bg-[#DFF0E8] text-[#173D2F]">
            <div className="h-24">
              <Illustration art="checkup" />
            </div>
            <div className="flex items-start gap-3 p-5">
              <Check className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-[15px] leading-6">
                Message sent. We’ll reply to <span className="font-semibold">{email}</span>.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-4 space-y-4">
            <FormError message={error} />
            <Field label="Name" autoComplete="name" value={name} onChange={setName} />
            <Field
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
            />
            <Field label="Subject (optional)" value={subject} onChange={setSubject} />
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-muted-foreground">
                Message
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-[16px] border border-transparent bg-secondary px-4 py-3 text-[16px] outline-none focus:border-foreground/60 focus:bg-background"
              />
            </label>
            <PrimaryButton busy={busy}>Send message</PrimaryButton>
          </form>
        )}
      </section>

      <Link to="/faq" className="mx-5 mt-8 block rounded-[24px] border border-foreground/10 p-5">
        <p className="font-display text-[17px] font-semibold">{c.faqCard.title}</p>
        <p className="mt-1 text-[14px] leading-5 text-muted-foreground">{c.faqCard.description}</p>
        <span className="mt-3 inline-block text-[14px] font-semibold underline underline-offset-4">
          {c.faqCard.buttonText}
        </span>
      </Link>
      <div className="h-6" />
    </InfoShell>
  );
}
