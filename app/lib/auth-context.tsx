import { createContext, useContext, type ReactNode } from "react";
import { useSession } from "~/features/auth/queries/auth-queries";
import type { AuthResponse } from "~/features/auth/types";
import type { ErrorResponse } from "~/lib/axios-client";

/**
 * Auth Context Type
 */
interface AuthContextType {
    session: AuthResponse | null | undefined;
    user: AuthResponse["user"] | null | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: ErrorResponse | null;
}

/**
 * Create Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Auth Provider Component
 * Wraps app and provides authentication state
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const sessionQuery = useSession();

    const value: AuthContextType = {
        session: sessionQuery.data,
        user: sessionQuery.data?.user,
        isAuthenticated: !!sessionQuery.data?.user,
        isLoading: sessionQuery.isLoading,
        error: sessionQuery.error,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use Auth Context
 * Must be used within AuthProvider
 */
export function useAuthContext() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuthContext must be used within AuthProvider");
    }

    return context;
}
