// ==================== Response Types ====================

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
  twoFactorEnabled: boolean;
}

export interface Session {
  id: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
}

export interface AuthResponse {
  session: Session;
  user: User;
}

export interface SignInResponse {
  redirect?: boolean;
  token?: string;
  session?: Session;
  user?: User;
}

export interface SignUpResponse {
  session: Session;
  user: User;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// ==================== Auth State Types ====================

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: ErrorResponse | null;
}

export type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: AuthResponse }
  | { type: "AUTH_ERROR"; payload: ErrorResponse }
  | { type: "AUTH_LOGOUT" };

// ==================== Social Provider Types ====================

export type SocialProvider = "github" | "google" | "facebook" | "twitter";

export interface SocialLoginConfig {
  provider: SocialProvider;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}
