import { QueryClient } from '@tanstack/react-query';

/** App-wide TanStack Query client. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30s before data is considered stale
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
