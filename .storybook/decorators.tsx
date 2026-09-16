import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterContextProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import type { Decorator } from "@storybook/react-vite";
import { routeTree } from "../src/routeTree.gen";
import { AuthProvider } from "../src/lib/auth";

/* A memory-history router built from the app's real route tree (routeTree.gen.ts), so any
 * component using Link, useNavigate, useRouterState or useRouter behaves exactly as it does in
 * the app — real paths resolve, nothing is faked — without needing an address bar. This uses
 * RouterContextProvider (router context only) rather than RouterProvider, so the story renders
 * itself instead of whatever route the location happens to match. */
export const withRouter =
  (initialPath = "/"): Decorator =>
  (Story) => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
      history: createMemoryHistory({ initialEntries: [initialPath] }),
    });
    return (
      <RouterContextProvider router={router}>
        <Story />
      </RouterContextProvider>
    );
  };

/* The real AuthProvider, same as the app. It calls the real iKAN Supabase project (the anon key
 * is public, same as in the shipped app) to check for a session — read-only, same as a signed-out
 * visit to the site. No test double: seeing the real "signed out" state is the point. */
export const withAuth: Decorator = (Story) => (
  <AuthProvider>
    <Story />
  </AuthProvider>
);

/* react-query is used by a few route contexts and hooks even outside data fetching. */
export const withQueryClient: Decorator = (Story) => {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <Story />
    </QueryClientProvider>
  );
};
