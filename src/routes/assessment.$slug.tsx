import { createFileRoute, redirect } from "@tanstack/react-router";

/* Moved to /assessments/<slug>; kept so old links still land. */
export const Route = createFileRoute("/assessment/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/assessments/$slug", params: { slug: params.slug }, replace: true });
  },
});
