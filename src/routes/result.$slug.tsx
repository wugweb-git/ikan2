import { createFileRoute, redirect } from "@tanstack/react-router";

/* Old result links (/result/<slug>?r=<id>) now live at /assessments/<slug>/result/<id>. */
export const Route = createFileRoute("/result/$slug")({
  beforeLoad: ({ params, search }) => {
    const r = (search as Record<string, unknown>)["r"];
    throw typeof r === "string"
      ? redirect({
          to: "/assessments/$slug/result/$id",
          params: { slug: params.slug, id: r },
          replace: true,
        })
      : redirect({
          to: "/history/assessments/$slug",
          params: { slug: params.slug },
          replace: true,
        });
  },
});
