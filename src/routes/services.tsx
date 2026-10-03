import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check, Clock3, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IkanMark } from "@/components/ikan-mark";
import { Illustration } from "@/components/art";
import { EntryCard } from "@/components/journal/entry-card";
import { Reveal } from "@/components/reveal";
import { assessments } from "@/lib/assessment/instruments";
import { programmes, dayCount } from "@/lib/equip/programs";
import { moodScale, type JournalEntry } from "@/lib/journal";
import { resources, resourceCategories, mediumLabel, lengthLabel, slugOf, type Resource } from "@/lib/resources";
import { consultants } from "@/lib/consultants";
import { contactPage } from "@/lib/content";
import consultantAsset from "@/assets/ikan-consultant.asset.json";

const description = "Explore iKAN assessments, guided programmes, a private mood journal, useful resources and upcoming consultations.";
export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — iKAN" },
      { name: "description", content: description },
      { property: "og:title", content: "Services — iKAN" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://app.ikanhealth.in/services" }],
  }),
  component: ServicesPage,
});

const sleep = assessments.find((a) => a.category === "sleep");
const programme = programmes.find((p) => p.slug === "sleep-tight") ?? programmes[0];
const consultant = consultants[0];
const showcase = [resources.find((r) => !r.medium && r.art === "sleep"), resources.find((r) => r.medium === "video" && r.poster), resources.find((r) => r.medium === "audio" && r.poster)].filter((r): r is Resource => Boolean(r));
const categories = resourceCategories.filter((c) => ["Sleep", "Stress", "Anxiety", "Burnout", "Work-Life", "Wellness"].includes(c));
const sampleEntry: JournalEntry = {
  id: "preview", date: "2026-09-29", createdAt: "2026-09-29T09:00:00+05:30",
  mood_rating: 4, sleep_rating: 4, stress_level: 1, pain_exist: false, context_tags: ["work"],
};

function Action({ to, children, light = false }: { to: "/assessments" | "/program" | "/journal" | "/resources" | "/consult"; children: ReactNode; light?: boolean }) {
  return <Button asChild variant={light ? "outline" : "default"} className="services-action h-12 rounded-full px-6 text-sm font-semibold"><Link to={to}>{children}<ArrowUpRight aria-hidden="true" /></Link></Button>;
}
function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="services-eyebrow">{children}</p>;
}
function PublicHeader() {
  const [open, setOpen] = useState(false);
  return <header className="services-header">
    <nav className="services-nav" aria-label="Main navigation">
      <Link to="/" aria-label="iKAN home" className="services-logo"><IkanMark className="h-9 w-9" /><span>iKAN</span></Link>
      <div className="services-nav-center"><Link to="/">Home</Link><Link to="/services" aria-current="page">Services</Link><Link to="/about">About Us</Link></div>
      <div className="services-nav-actions"><Button asChild variant="outline" className="rounded-full px-5"><Link to="/contact">Let's Talk</Link></Button><Button asChild className="rounded-full px-5"><Link to="/login" search={{ redirect: "/" }}>Sign in</Link></Button></div>
      <Button variant="ghost" size="icon" className="services-menu" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
    </nav>
    {open && <div className="services-mobile-menu"><Link onClick={() => setOpen(false)} to="/">Home</Link><Link onClick={() => setOpen(false)} to="/services" aria-current="page">Services</Link><Link onClick={() => setOpen(false)} to="/about">About Us</Link><Link onClick={() => setOpen(false)} to="/contact">Let's Talk</Link><Link onClick={() => setOpen(false)} to="/login" search={{ redirect: "/" }}>Sign in</Link></div>}
  </header>;
}
function AssessmentPhone() {
  return <div className="services-phone-scene" aria-label="Preview of the iKAN sleep assessment">
    <div className="services-phone">
      <div className="services-phone-notch" aria-hidden="true" />
      <div className="services-phone-top"><IkanMark className="h-5 w-5" /><span>Assessment</span><span>•••</span></div>
      <div className="services-phone-body">
        <p className="services-phone-kicker">SLEEP / PRIVATE CHECK-IN</p>
        <h3>How well have you been sleeping?</h3>
        <p className="services-phone-intro">A closer look at your nights, and how they carry into your days.</p>
        <div className="services-phone-meta"><span>{sleep?.questions.length ?? 8} questions</span><span><Clock3 className="h-3 w-3" /> {sleep?.minutes ?? 10} min</span></div>
        <div className="services-phone-progress"><span>YOUR PROGRESS</span><strong>5 of {sleep?.questions.length ?? 8} answered</strong><div className="services-track"><span /></div></div>
        <div className="services-phone-result"><span>YOUR RESULT</span><strong>A clearer picture of your sleep.</strong><p>What this measured, and what it does not</p><ArrowRight className="h-4 w-4" aria-hidden="true" /></div>
        <span className="services-phone-privacy">Your answers stay yours.</span>
      </div>
      <div className="services-phone-home" />
    </div>
    <div className="services-phone-note"><span className="services-note-dot" /> Not a diagnosis. A place to begin.</div>
  </div>;
}
function EquipPreview() {
  if (!programme) return null;
  const count = dayCount(programme);
  return <div className="services-equip-preview">
    <Link to="/program/$slug" params={{ slug: programme.slug }} className="services-programme-card">
      <img src={programme.cover} alt="Sleep Tight programme cover" />
      <span className="services-programme-overlay"><span className="services-programme-tag">PROGRAMME / {programme.name}</span><strong>Small steps towards better sleep.</strong><span>{count} days · guided activities <ArrowUpRight className="h-5 w-5" /></span></span>
    </Link>
    <div className="services-day-strip"><span className="services-day-number">04 <small>/ {count}</small></span><div><strong>A day at a time</strong><span>Read <i /> Practise <i /> Reflect</span></div><span className="services-day-check"><Check className="h-5 w-5" /></span></div>
  </div>;
}
function MoodPreview() {
  const [selected, setSelected] = useState(4);
  return <div className="services-mood-preview">
    <div className="services-mood-scale"><div className="services-ui-top"><span>YOUR DAILY CHECK-IN</span><span>01 / 05</span></div><h3>How are you feeling?</h3><p>There is no right answer.</p><div className="services-mood-options" role="radiogroup" aria-label="Preview mood selection">{moodScale.map((point) => <Button key={point.value} type="button" variant="ghost" role="radio" aria-checked={selected === point.value} aria-label={point.label} onClick={() => setSelected(point.value)} className={selected === point.value ? "services-mood-option is-selected" : "services-mood-option"}><span aria-hidden="true">{point.emoji}</span><small>{point.label}</small></Button>)}</div></div>
    <div className="services-entry-preview"><div className="services-ui-top"><span>YOUR JOURNAL</span><span>TUESDAY</span></div><EntryCard entry={{ ...sampleEntry, mood_rating: selected }} showDate /><div className="services-journal-detail"><span>Sleep <b>Good</b></span><span>Stress <b>Chill</b></span></div></div>
  </div>;
}
function ResourceCard({ resource, prominent = false }: { resource: Resource; prominent?: boolean }) {
  return <Link to="/resources/$slug" params={{ slug: slugOf(resource) }} className={`services-resource-card ${prominent ? "is-prominent" : ""}`}>
    <div className="services-resource-image">{resource.poster ? <img src={resource.poster} alt="" loading="lazy" /> : <Illustration art={resource.art} />}<span>{mediumLabel(resource)}</span></div>
    <div className="services-resource-copy"><p>{resource.category} <span>·</span> {lengthLabel(resource)}</p><h3>{resource.title}</h3><ArrowUpRight aria-hidden="true" className="h-5 w-5" /></div>
  </Link>;
}
function ConsultationPreview() {
  if (!consultant) return null;
  return <Link to="/consult" className="services-consultant-card">
    <div className="services-consultant-photo"><img src={consultantAsset.url} alt={consultant.name} loading="lazy" /><span>MEET THE PEOPLE BEHIND THE CARE</span></div>
    <div className="services-consultant-details"><div><p>{consultant.role} · {consultant.credentials}</p><h3>{consultant.name}</h3></div><ArrowUpRight className="h-6 w-6" aria-hidden="true" /></div>
    <div className="services-consultant-facts"><span>{consultant.years} years experience</span><span>{consultant.languages.join(" · ")}</span><span>{consultant.sessions.map((s) => s.mode).join(" · ")}</span></div>
  </Link>;
}
function Newsletter() {
  const [email, setEmail] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    // No mailing-list service exists in this project. Open an addressed request rather than claim a subscription was saved.
    window.location.href = `mailto:${contactPage.supportEmail}?subject=${encodeURIComponent("iKAN newsletter request")}&body=${encodeURIComponent(`Please add ${email.trim()} to the iKAN newsletter when it becomes available.`)}`;
  }
  return <section className="services-newsletter" aria-labelledby="newsletter-heading"><div className="services-container services-newsletter-inner"><div><Eyebrow>STAY IN TOUCH</Eyebrow><h2 id="newsletter-heading">A little help, when it is useful.</h2><p>Thoughtful notes on feeling better, sent only when we have something worth sharing.</p></div><div><form onSubmit={submit}><label className="sr-only" htmlFor="services-email">Email address</label><input id="services-email" type="email" autoComplete="email" required placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} /><Button type="submit" className="h-12 rounded-full px-6">Request updates <ArrowUpRight /></Button></form><p className="services-newsletter-fine">Opens your email app to request updates. No spam; no signup is saved here.</p></div></div></section>;
}
function Footer() {
  return <footer className="services-footer"><div className="services-container"><div className="services-footer-grid"><div><Link to="/" className="services-logo"><IkanMark className="h-9 w-9" /><span>iKAN</span></Link><p>Room to understand yourself. Tools for what comes next.</p></div><div><strong>EXPLORE</strong><Link to="/">Home</Link><Link to="/services">Services</Link><Link to="/about">About Us</Link><Link to="/resources">Resources</Link><Link to="/consult">Consultation</Link></div><div><strong>HELP</strong><Link to="/contact">Contact</Link><Link to="/support">Support</Link><Link to="/faq">FAQs</Link><a href={`mailto:${contactPage.supportEmail}`}>{contactPage.supportEmail}</a></div><div><strong>LEGAL</strong><Link to="/legal/$slug" params={{ slug: "privacy-policy" }}>Privacy policy</Link><Link to="/legal/$slug" params={{ slug: "terms" }}>Terms of use</Link><Link to="/legal/$slug" params={{ slug: "cancellation-policy" }}>Cancellation policy</Link><Link to="/legal/$slug" params={{ slug: "return-policy" }}>Return policy</Link></div></div><div className="services-footer-bottom"><span>© {new Date().getFullYear()} iKAN. Made for the days we live.</span><p>iKAN is not an emergency service. If you are in immediate danger, call <a href="tel:112">112</a> or visit <Link to="/support">crisis support</Link>.</p></div></div></footer>;
}
function ServicesPage() {
  return <div className="services-page"><PublicHeader /><main>
    <div className="services-hero services-container"><Eyebrow>SERVICES</Eyebrow><h1>Five ways to work out<br className="services-desktop-break" /> where you are, and <em>what helps.</em></h1><p>Start with a question. Carry on with a habit.<br className="services-desktop-break" /> Talk to someone when you want to.</p></div>
    <section className="services-assessment services-section" aria-labelledby="assessment-title"><div className="services-container services-split"><Reveal className="services-copy"><Eyebrow>01 / ASSESSMENT</Eyebrow><h2 id="assessment-title">Assessment</h2><h3>Most people know something is off before they can name it.</h3><p>A few short questions, answered privately, and a result that explains what it measured rather than handing you a number to interpret alone.</p><div className="services-fact"><strong>{assessments.length.toString().padStart(2, "0")}</strong><span>screenings to help you find a starting point</span></div><Action to="/assessments">Take an assessment</Action></Reveal><Reveal className="services-visual" delay={100}><AssessmentPhone /></Reveal></div></section>
    <section className="services-equip services-section" aria-labelledby="equip-title"><div className="services-container services-split"><Reveal className="services-visual"><EquipPreview /></Reveal><Reveal className="services-copy" delay={100}><Eyebrow>02 / DAILY PRACTICE</Eyebrow><div className="services-heading-row"><h2 id="equip-title">Equip</h2><span className="services-badge">BETA</span></div><h3>Knowing is not the same as changing.</h3><p>Programmes built on CBT practice that run a day at a time. Short enough to keep up with on a bad week, structured enough to add up over a good month.</p><div className="services-fact"><strong>{programmes.length.toString().padStart(2, "0")}</strong><span>guided programmes available now</span></div><Action to="/program">See the programmes</Action></Reveal></div></section>
    <section className="services-mood services-section" aria-labelledby="mood-title"><div className="services-container services-split"><Reveal className="services-copy"><Eyebrow>03 / EVERYDAY REFLECTION</Eyebrow><h2 id="mood-title">Mood Journal</h2><h3>One result is a snapshot. A few weeks of notes is the thing a single score can never show you.</h3><p>Five taps is enough. Write as much or as little as you want on top of it. Nobody reads it but you.</p><Action to="/journal">Open the journal</Action></Reveal><Reveal className="services-visual" delay={100}><MoodPreview /></Reveal></div></section>
    <section className="services-resources services-section" aria-labelledby="resources-title"><div className="services-container services-split"><Reveal className="services-copy"><Eyebrow>04 / THE LIBRARY</Eyebrow><h2 id="resources-title">Resources</h2><h3>Good information can be its own kind of relief.</h3><p>Articles, audio and video that help you understand what you are experiencing, and what you might try next.</p><div className="services-categories" aria-label="Library topics">{categories.map((c) => <span key={c}>{c}</span>)}</div><Action to="/resources">Read the library</Action></Reveal><Reveal className="services-resource-grid services-visual" delay={100}>{showcase.map((r, i) => <ResourceCard key={r.id} resource={r} prominent={i === 0} />)}</Reveal></div></section>
    <section className="services-consultation services-section" aria-labelledby="consult-title"><div className="services-container services-split"><Reveal className="services-copy"><Eyebrow>05 / HUMAN SUPPORT</Eyebrow><div className="services-heading-row"><h2 id="consult-title">Consultation</h2><span className="services-badge">COMING SOON</span></div><h3>Self-guided tools take you a long way. Not all the way.</h3><p>Therapists, psychiatrists and counsellors, with your choice of language and session mode.</p><Action to="/consult" light>See what is coming</Action></Reveal><Reveal className="services-visual" delay={100}><ConsultationPreview /></Reveal></div></section>
    <Newsletter />
  </main><Footer /></div>;
}
