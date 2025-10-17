import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-client";
import { toErrorResponse, type ErrorResponse } from "~/lib/axios-client";
import { AuthApiService } from "../api/auth-api";
import type {
  SignInEmailInput,
  SignUpEmailInput,
  ForgetPasswordInput,
  ResetPasswordInput,
} from "../schema/auth.schema";
import type { SignInResponse, SignUpResponse, AuthResponse } from "../types";

/**
 * Hook to get current session
 * @returns Query result with session data
 */
export function useSession() {
  return useQuery<AuthResponse, ErrorResponse>({
    queryKey: queryKeys.auth.session(),
    queryFn: async () => {
      try {
        return await AuthApiService.getSession();
      } catch (error) {
        throw toErrorResponse(error);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry session queries
  });
}

/**
 * Hook to sign in with email
 * @returns Mutation result with loading state and error
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation<SignInResponse, ErrorResponse, SignInEmailInput>({
    mutationFn: async (data: SignInEmailInput) => {
      try {
        return await AuthApiService.signInEmail(data);
      } catch (error) {
        throw toErrorResponse(error);
      }
    },
    onSuccess: (data) => {
      // Update session cache after successful login
      queryClient.setQueryData(queryKeys.auth.session(), {
        session: data.session,
        user: data.user,
      });
    },
  });
}

/**
 * Hook to sign up with email
 * @returns Mutation result with loading state and error
 */
export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation<SignUpResponse, ErrorResponse, SignUpEmailInput>({
    mutationFn: async (data: SignUpEmailInput) => {
      try {
        return await AuthApiService.signUpEmail(data);
      } catch (error) {
        throw toErrorResponse(error);
      }
    },
    onSuccess: (data) => {
      // Update session cache after successful registration
      queryClient.setQueryData(queryKeys.auth.session(), {
        session: data.session,
        user: data.user,
      });
    },
  });
}

/**
 * Hook to sign out
 * @returns Mutation result with loading state and error
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation<void, ErrorResponse, void>({
    mutationFn: async () => {
      try {
        await AuthApiService.signOut();
      } catch (error) {
        throw toErrorResponse(error);
      }
    },
    onSuccess: () => {
      // Clear session cache after logout
      queryClient.setQueryData(queryKeys.auth.session(), null);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/**
 * Hook to request password reset
 * @returns Mutation result with loading state and error
 */
export function useForgetPassword() {
  return useMutation<{ success: boolean; message: string }, ErrorResponse, ForgetPasswordInput>({
    mutationFn: async (data: ForgetPasswordInput) => {
      try {
        return await AuthApiService.forgetPassword(data);
      } catch (error) {
        throw toErrorResponse(error);
      }
    },
  });
}

/**
 * Hook to reset password with token
 * @returns Mutation result with loading state and error
 */
export function useResetPassword() {
  return useMutation<{ success: boolean; message: string }, ErrorResponse, ResetPasswordInput>({
    mutationFn: async (data: ResetPasswordInput) => {
      try {
        return await AuthApiService.resetPassword(data);
      } catch (error) {
        throw toErrorResponse(error);
      }
    },
  });
}

/**
 * Hook to sign in with social provider
 * @returns Mutation result with loading state and error
 */
export function useSocialSignIn() {
  return useMutation<{ url: string }, ErrorResponse, string>({
    mutationFn: async (provider: string) => {
      try {
        return await AuthApiService.signInSocial(provider);
      } catch (error) {
        throw toErrorResponse(error);
      }
    },
    onSuccess: (data) => {
      // Redirect to social auth URL
      window.location.href = data.url;
    },
  });
}

/**
 * Combined auth hook with all operations
 * This provides a unified interface similar to the old useAuth hook
 */
export function useAuth() {
  const sessionQuery = useSession();
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const signOutMutation = useSignOut();
  const socialSignInMutation = useSocialSignIn();

  return {
    // Session data
    session: sessionQuery.data,
    isSessionLoading: sessionQuery.isLoading,
    sessionError: sessionQuery.error,

    // Sign in
    signIn: signInMutation.mutate,
    signInAsync: signInMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,

    // Sign up
    signUp: signUpMutation.mutate,
    signUpAsync: signUpMutation.mutateAsync,
    isSigningUp: signUpMutation.isPending,
    signUpError: signUpMutation.error,

    // Sign out
    signOut: signOutMutation.mutate,
    signOutAsync: signOutMutation.mutateAsync,
    isSigningOut: signOutMutation.isPending,
    signOutError: signOutMutation.error,

    // Social sign in
    signInWithSocial: socialSignInMutation.mutate,
    signInWithSocialAsync: socialSignInMutation.mutateAsync,
    isSocialSigningIn: socialSignInMutation.isPending,
    socialSignInError: socialSignInMutation.error,

    // Combined loading state
    isLoading:
      sessionQuery.isLoading ||
      signInMutation.isPending ||
      signUpMutation.isPending ||
      signOutMutation.isPending ||
      socialSignInMutation.isPending,

    // Combined error (returns the first error found)
    error:
      sessionQuery.error ||
      signInMutation.error ||
      signUpMutation.error ||
      signOutMutation.error ||
      socialSignInMutation.error ||
      null,
  };
}
