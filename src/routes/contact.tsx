import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Mail, Phone, ShieldAlert } from "lucide-react";
import { InfoShell } from "@/components/info-shell";
import { Illustration } from "@/components/art";
import { pageMeta } from "@/components/equip/program-header";
import { Field, FormError, PrimaryButton } from "@/components/auth-ui";
import { useAuth, LEGACY_ANON_KEY, LEGACY_API, displayName } from "@/lib/auth";
import { contactPage as c } from "@/lib/content";
import * as v from "@/lib/validate";

export const Route = createFileRoute("/contact")({
  head: () => pageMeta("Contact us", c.heroSubtitle, "/contact"),
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
  const [touched, setTouched] = useState(false);

  const { errors, ok } = v.validate(
    { name, email, subject, message },
    {
      name: v.personName,
      email: v.email,
      subject: v.maxLength(120, "the subject"),
      message: v.all(
        v.minLength(10, "Write a little more so we can help (10 characters or more)."),
        v.maxLength(2000, "your message"),
      ),
    },
  );
  const show = (k: keyof typeof errors) => (touched ? errors[k] : undefined);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!ok) {
      setError(null);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${LEGACY_API}/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LEGACY_ANON_KEY}`,
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
        <h1 className="type-headline-lg">{c.heroTitle}</h1>
        <p className="mt-2 text-[16px] leading-6 text-muted-foreground">{c.heroSubtitle}</p>
      </header>

      <section className="mx-5 mt-6 overflow-hidden rounded-[24px] bg-error-container text-on-error-container">
        <div className="flex gap-3 p-5">
          <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0" />
          <div>
            <p className="type-subhead">{c.crisisCard.title}</p>
            <p className="type-label-lg mt-1">{c.crisisCard.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.crisisCard.buttons.map((b) => (
                <a
                  key={b.label}
                  href={b.action}
                  className="type-body-md font-semibold inline-flex h-10 items-center gap-2 rounded-full bg-on-error-container px-4 text-error-container"
                >
                  <Phone className="h-4 w-4" /> {b.label}
                </a>
              ))}
              <Link
                to="/support"
                className="type-body-md font-semibold inline-flex h-10 items-center rounded-full border border-on-error-container/30 px-4"
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
              <p className="type-action mt-3">{m.title}</p>
              <p className="type-label-md mt-0.5 text-muted-foreground">{m.description}</p>
              <p className="type-body-sm font-semibold mt-2 break-all">{m.value}</p>
            </a>
          </li>
        ))}
      </ul>

      <section className="mx-5 mt-8">
        <h2 className="type-title-lg">{c.formTitle}</h2>
        <p className="type-body-md mt-1 text-muted-foreground">{c.formSubtitle}</p>
        {sent ? (
          <div className="mt-4 overflow-hidden rounded-[24px] bg-[#DFF0E8] text-[#173D2F]">
            <div className="h-24">
              <Illustration art="checkup" />
            </div>
            <div className="flex items-start gap-3 p-5">
              <Check className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="type-body">
                Message sent. We’ll reply to <span className="font-semibold">{email}</span>.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-4 space-y-4">
            <FormError message={error} />
            <Field
              label="Name"
              autoComplete="name"
              value={name}
              onChange={setName}
              maxLength={60}
              error={show("name")}
            />
            <Field
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              maxLength={254}
              error={show("email")}
            />
            <Field
              label="Subject (optional)"
              value={subject}
              onChange={setSubject}
              maxLength={120}
              error={show("subject")}
            />
            <label className="block">
              <span className="type-body-sm font-medium mb-1.5 flex justify-between text-muted-foreground">
                Message
                <span className="tabular-nums">{message.length}/2000</span>
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={2000}
                aria-invalid={Boolean(show("message"))}
                className={`w-full resize-none rounded-[16px] border bg-secondary px-4 py-3 text-[16px] outline-none focus:border-foreground/60 focus:bg-background ${show("message") ? "border-error" : "border-transparent"}`}
              />
              {show("message") ? (
                <span role="alert" className="type-body-sm mt-1.5 block text-error">
                  {show("message")}
                </span>
              ) : null}
            </label>
            <PrimaryButton busy={busy}>Send message</PrimaryButton>
          </form>
        )}
      </section>

      <Link to="/faq" className="mx-5 mt-8 block rounded-[24px] border border-foreground/10 p-5">
        <p className="type-subhead">{c.faqCard.title}</p>
        <p className="type-label-lg mt-1 text-muted-foreground">{c.faqCard.description}</p>
        <span className="type-body-md font-semibold mt-3 inline-block underline">
          {c.faqCard.buttonText}
        </span>
      </Link>
      <div className="h-6" />
    </InfoShell>
  );
}
