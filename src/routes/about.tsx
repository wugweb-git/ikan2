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
  head: () => pageMeta("About iKAN", a.hero.subtitle, "/about"),
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
    <InfoShell wide>
      <header className="px-5">
        <h1 className="font-display text-[34px] font-semibold leading-[1.15] tracking-[-0.01em]">
          {a.hero.title}
        </h1>
        <p className="type-body-xl mt-3 text-muted-foreground">{a.hero.subtitle}</p>
      </header>

      <div className="mx-5 mt-6 h-44 overflow-hidden rounded-[28px]">
        <Illustration art="mood" />
      </div>

      <section className="mt-8 px-5">
        <p className="type-body-sm font-semibold text-[#2B634D]">{a.story.label}</p>
        <h2 className="type-headline-sm mt-1">{unmark(a.story.heading)}</h2>
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
            <p className="type-body-sm font-semibold opacity-75">{m.label}</p>
            <p className="type-title-lg mt-1">{m.title}</p>
            <p className="type-body mt-2 opacity-85">{m.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 px-5">
        <h2 className="type-title-lg">{a.valuesHeading}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {a.values.map((v) => {
            const Icon = valueIcon[v.iconName] ?? Heart;
            return (
              <div key={v.title} className="rounded-[20px] bg-secondary p-4">
                <Icon className="h-6 w-6" />
                <p className="type-title-md mt-3">{v.title}</p>
                <p className="type-body-sm mt-1 text-muted-foreground">{v.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 px-5">
        <h2 className="type-title-lg">{a.howItWorks.heading}</h2>
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
                  <span className="type-subhead block">{s.title}</span>
                  <span className="type-label-lg block text-[#2B634D]">{s.tagline}</span>
                  <span className="type-body mt-1 block text-muted-foreground">
                    {s.description}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
        <Link
          to="/assessments"
          className="type-action mt-4 flex h-12 items-center justify-center rounded-full bg-foreground text-background"
        >
          Get started
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="type-title-lg px-5">{a.whoFor.heading}</h2>
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
                <p className="type-subhead">{g.title}</p>
                <p className="type-label-lg text-[#2B634D]">{g.tagline}</p>
                <p className="mt-2 text-[14px] leading-6 text-muted-foreground">{g.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 px-5">
        <h2 className="type-title-lg">{a.teamHeading}</h2>
        <p className="type-body mt-1 text-muted-foreground">{a.teamDescription}</p>
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
                  <p className="type-subhead">{f.name}</p>
                  <p className="type-body-sm text-muted-foreground">{f.role}</p>
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
