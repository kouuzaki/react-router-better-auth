import { QueryClient, type DefaultOptions } from "@tanstack/react-query";
import { toErrorResponse, type ErrorResponse } from "./axios-client";

/**
 * Default query options for all queries
 */
const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof Error) {
        const apiError = toErrorResponse(error);
        if (apiError.statusCode >= 400 && apiError.statusCode < 500) {
          return false;
        }
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: false, // Don't retry mutations by default
  },
};

/**
 * Create query client with default options
 */
export const queryClient = new QueryClient({
  defaultOptions,
});

/**
 * Query keys factory for better organization
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },
  // Add more modules here as needed
  // profile: {
  //   all: ["profile"] as const,
  //   detail: (id: string) => [...queryKeys.profile.all, "detail", id] as const,
  // },
} as const;
