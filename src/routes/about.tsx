import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ClipboardList,
  FlaskConical,
  Handshake,
  Heart,
  Shield,
  Sparkles,
  UserRoundSearch,
  type LucideIcon,
} from "lucide-react";
import { InfoShell } from "@/components/info-shell";
import { Avatar, Illustration } from "@/components/art";
import { pageMeta } from "@/components/equip/program-header";
import { aboutPage as a, unmark } from "@/lib/content";

export const Route = createFileRoute("/about")({
  head: () => pageMeta("About iKAN", a.hero.subtitle),
  component: AboutPage,
});

const valueIcon: Record<string, LucideIcon> = {
  heart: Heart,
  shield: Shield,
  "flask-conical": FlaskConical,
  handshake: Handshake,
};
const stepIcon = [ClipboardList, UserRoundSearch, Sparkles];
/** Team photos copied from the old iKan repo (public/team), named by first name. */
const photoOf = (name: string) => `/team/${name.split(" ")[0]!.toLowerCase()}.jpg`;
const hue = (name: string) => [...name].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 360, 7);
const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

function AboutPage() {
  return (
    <InfoShell>
      <header className="px-5">
        <h1 className="font-display text-[34px] font-semibold leading-[1.15] tracking-[-0.01em]">
          {a.hero.title}
        </h1>
        <p className="mt-3 text-[17px] leading-7 text-muted-foreground">{a.hero.subtitle}</p>
      </header>

      <div className="mx-5 mt-6 h-44 overflow-hidden rounded-[28px]">
        <Illustration art="mood" />
      </div>

      <section className="mt-8 px-5">
        <p className="text-[13px] font-semibold text-[#2B634D]">{a.story.label}</p>
        <h2 className="mt-1 font-display text-[24px] font-semibold leading-8">
          {unmark(a.story.heading)}
        </h2>
        <div className="mt-3 space-y-4 text-[16px] leading-7 text-foreground/85">
          {a.story.paragraphs.map((p) => (
            <p key={p.slice(0, 20)}>{unmark(p)}</p>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-3 px-5">
        {[a.mission, a.vision].map((m, i) => (
          <div
            key={m.label}
            className={
              i === 0
                ? "rounded-[24px] bg-foreground p-5 text-background"
                : "rounded-[24px] bg-[#DFF0E8] p-5 text-[#173D2F]"
            }
          >
            <p className="text-[13px] font-semibold opacity-75">{m.label}</p>
            <p className="mt-1 font-display text-[20px] font-semibold leading-7">{m.title}</p>
            <p className="mt-2 text-[15px] leading-6 opacity-85">{m.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 px-5">
        <h2 className="font-display text-[22px] font-semibold">{a.valuesHeading}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {a.values.map((v) => {
            const Icon = valueIcon[v.iconName] ?? Heart;
            return (
              <div key={v.title} className="rounded-[20px] bg-secondary p-4">
                <Icon className="h-6 w-6" />
                <p className="mt-3 font-display text-[16px] font-semibold">{v.title}</p>
                <p className="mt-1 text-[13px] leading-5 text-muted-foreground">{v.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 px-5">
        <h2 className="font-display text-[22px] font-semibold">{a.howItWorks.heading}</h2>
        <ol className="mt-4 space-y-4">
          {a.howItWorks.steps.map((s, i) => {
            const Icon = stepIcon[i] ?? Sparkles;
            return (
              <li key={s.title} className="flex gap-4">
                <span className="relative flex flex-col items-center">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background">
                    <Icon className="h-5 w-5" />
                  </span>
                  {i < a.howItWorks.steps.length - 1 ? (
                    <span className="mt-1 w-px flex-1 bg-foreground/15" />
                  ) : null}
                </span>
                <span className="pb-2">
                  <span className="block font-display text-[17px] font-semibold">{s.title}</span>
                  <span className="block text-[14px] font-medium text-[#2B634D]">{s.tagline}</span>
                  <span className="mt-1 block text-[15px] leading-6 text-muted-foreground">
                    {s.description}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
        <Link
          to="/assessments"
          className="mt-4 flex h-12 items-center justify-center rounded-full bg-foreground text-[15px] font-semibold text-background"
        >
          Get started
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="px-5 font-display text-[22px] font-semibold">{a.whoFor.heading}</h2>
        <div className="no-scrollbar mt-4 flex snap-x gap-3 overflow-x-auto px-5 pb-1">
          {a.whoFor.groups.map((g, i) => (
            <div
              key={g.title}
              className="w-[260px] shrink-0 snap-start overflow-hidden rounded-[24px] border border-foreground/10"
            >
              <div className="h-24">
                <Illustration art={(["checkup", "work", "measure"] as const)[i] ?? "checkup"} />
              </div>
              <div className="p-4">
                <p className="font-display text-[17px] font-semibold">{g.title}</p>
                <p className="text-[14px] font-medium text-[#2B634D]">{g.tagline}</p>
                <p className="mt-2 text-[14px] leading-6 text-muted-foreground">{g.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 px-5">
        <h2 className="font-display text-[22px] font-semibold">{a.teamHeading}</h2>
        <p className="mt-1 text-[15px] leading-6 text-muted-foreground">{a.teamDescription}</p>
        <ul className="mt-4 space-y-3">
          {a.founders.map((f) => (
            <li key={f.name} className="rounded-[24px] bg-secondary p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  text={initialsOf(f.name)}
                  hue={hue(f.name)}
                  size={64}
                  photo={photoOf(f.name)}
                />
                <div>
                  <p className="font-display text-[17px] font-semibold">{f.name}</p>
                  <p className="text-[13px] text-muted-foreground">{f.role}</p>
                </div>
              </div>
              <p className="mt-3 text-[14px] leading-6 text-foreground/85">{f.bio}</p>
            </li>
          ))}
        </ul>
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {a.team.map((t) => (
            <li
              key={t.name}
              className="flex flex-col items-center rounded-[20px] border border-foreground/10 p-3 text-center"
            >
              <Avatar
                text={initialsOf(t.name)}
                hue={hue(t.name)}
                size={56}
                photo={photoOf(t.name)}
              />
              <p className="mt-2 text-[13px] font-semibold leading-4">{t.name}</p>
              <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{t.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="h-6" />
    </InfoShell>
  );
}
