import { createFileRoute, redirect } from "@tanstack/react-router";

/* Moved to /history/programs; kept so old links still land. */
export const Route = createFileRoute("/program/history")({
  beforeLoad: () => {
    throw redirect({ to: "/history/program", replace: true });
  },
});
