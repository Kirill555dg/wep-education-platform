import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // LMS UX: data is mostly read-heavy; avoid refetch storms on focus.
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10_000,
    },
  },
});

export function QueryProvider(props: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}


