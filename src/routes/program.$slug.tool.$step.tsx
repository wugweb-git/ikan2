import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { accentStyle, IconButton, TopAppBar } from "@/components/equip/m3";
import { StepView } from "@/components/equip/steps";
import { diaryRows, findStep, getProgramme } from "@/lib/equip/programs";

/** Exercises Notion marks "available for ever, on demand". */
export const Route = createFileRoute("/program/$slug/tool/$step")({
  loader: ({ params }) => {
    const programme = getProgramme(params.slug);
    const step = programme ? findStep(programme, params.step) : undefined;
    if (!programme || !step || !programme.tools.some((t) => `${t.day}.${t.n}` === params.step))
      throw notFound();
    return { slug: programme.slug, id: step.id };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getProgramme(loaderData.slug) : undefined;
    const s = p && loaderData ? findStep(p, loaderData.id) : undefined;
    return {
      meta: [
        { title: s && p ? `${s.block.title} — ${p.name} — iKAN` : "Tool — iKAN" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: ToolPage,
});

function ToolPage() {
  const { slug, id } = Route.useLoaderData();
  const programme = getProgramme(slug)!;
  const step = findStep(programme, id)!;
  const navigate = useNavigate();
  const back = () => navigate({ to: "/program/$slug", params: { slug } });
  const day = Number(id.split(".")[0]);

  return (
    <div className="min-h-dvh bg-canvas" style={accentStyle(programme.accent)}>
      <div className="mx-auto min-h-dvh w-full max-w-app bg-background">
        <TopAppBar
          leading={
            <IconButton label="Back" onClick={back}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
          title={step.block.title}
          subtitle={programme.name}
        />
        <main className="px-4 pb-36 pt-2">
          <StepView
            step={{
              ...step,
              view: "scope" in step.view ? { ...step.view, scope: "all" } : step.view,
            }}
            diaryRows={diaryRows(programme)}
            ctx={{ slug, day, isLast: false, onBack: undefined, onNext: back, finishLabel: "Done" }}
          />
        </main>
      </div>
    </div>
  );
}
