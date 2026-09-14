import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ErrorScreen, NotFoundScreen, PageSkeleton } from "./components/skeleton";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: PageSkeleton,
    defaultPendingMs: 200,
    defaultPendingMinMs: 300,
    defaultErrorComponent: ({ reset }) => <ErrorScreen reset={reset} />,
    defaultNotFoundComponent: NotFoundScreen,
  });

  return router;
};
