import { createFileRoute, redirect } from "@tanstack/react-router";

/* Moved to /assessments; kept so old links still land. */
export const Route = createFileRoute("/assessment/")({
  beforeLoad: () => {
    throw redirect({ to: "/assessments", replace: true });
  },
});
