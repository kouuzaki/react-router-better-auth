import { axiosClient } from "~/lib/axios-client";
import type {
  SignInEmailInput,
  SignUpEmailInput,
  ForgetPasswordInput,
  ResetPasswordInput,
} from "../schema/auth.schema";
import type { SignInResponse, SignUpResponse, AuthResponse } from "../types";

/**
 * Authentication API endpoints
 * Base path: /api (handled by Vite proxy)
 * All endpoints are prefixed with /auth
 */
const AUTH_ENDPOINTS = {
  SIGN_IN: "/auth/sign-in/email",
  SIGN_UP: "/auth/sign-up/email",
  SIGN_OUT: "/auth/sign-out",
  SESSION: "/auth/get-session",
  FORGET_PASSWORD: "/auth/forget-password",
  RESET_PASSWORD: "/auth/reset-password",
  SOCIAL_SIGN_IN: (provider: string) => `/auth/sign-in/${provider}`,
} as const;

/**
 * Authentication API service using Axios
 * All methods return promises that throw ApiError on failure
 */
export class AuthApiService {
  /**
   * Sign in with email and password
   */
  static async signInEmail(data: SignInEmailInput): Promise<SignInResponse> {
    const response = await axiosClient.post<SignInResponse>(AUTH_ENDPOINTS.SIGN_IN, {
      email: data.email,
      password: data.password,
      callbackURL: data.callbackURL || "/dashboard",
      rememberMe: data.rememberMe,
    });

    return response.data;
  }

  /**
   * Sign up with email and password
   */
  static async signUpEmail(data: SignUpEmailInput): Promise<SignUpResponse> {
    const response = await axiosClient.post<SignUpResponse>(AUTH_ENDPOINTS.SIGN_UP, {
      email: data.email,
      password: data.password,
      name: data.name,
      image: data.image,
      callbackURL: data.callbackURL || "/dashboard",
    });

    return response.data;
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    await axiosClient.post(AUTH_ENDPOINTS.SIGN_OUT);
  }

  /**
   * Get current session
   */
  static async getSession(): Promise<AuthResponse> {
    const response = await axiosClient.get<AuthResponse>(AUTH_ENDPOINTS.SESSION);
    return response.data;
  }

  /**
   * Request password reset
   */
  static async forgetPassword(data: ForgetPasswordInput): Promise<{ success: boolean; message: string }> {
    const response = await axiosClient.post<{ success: boolean; message: string }>(
      AUTH_ENDPOINTS.FORGET_PASSWORD,
      {
        email: data.email,
        redirectTo: data.redirectTo || "/auth/reset-password",
      }
    );

    return response.data;
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: ResetPasswordInput): Promise<{ success: boolean; message: string }> {
    const response = await axiosClient.post<{ success: boolean; message: string }>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      {
        token: data.token,
        newPassword: data.password,
      }
    );

    return response.data;
  }

  /**
   * Sign in with social provider
   * Returns redirect URL for social authentication
   */
  static async signInSocial(provider: string): Promise<{ url: string }> {
    const response = await axiosClient.post<{ url: string }>(
      AUTH_ENDPOINTS.SOCIAL_SIGN_IN(provider),
      {
        callbackURL: "/dashboard",
      }
    );

    return response.data;
  }
}
