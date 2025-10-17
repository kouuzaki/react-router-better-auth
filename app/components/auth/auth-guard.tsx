import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "~/lib/auth-context";
import { Spinner } from "~/components/ui/spinner";

/**
 * Auth Guard Options
 */
interface AuthGuardOptions {
    /**
     * Whether to redirect to login if not authenticated
     * @default true
     */
    redirectToLogin?: boolean;

    /**
     * Custom redirect path
     * @default "/auth/login"
     */
    redirectPath?: string;

    /**
     * Custom loading component
     */
    loadingComponent?: ReactNode;

    /**
     * Allow access if user is not authenticated
     * Useful for public routes that need auth context
     * @default false
     */
    allowUnauthenticated?: boolean;
}

/**
 * Auth Guard Props
 */
interface AuthGuardProps extends AuthGuardOptions {
    children: ReactNode;
}

/**
 * Auth Guard Component
 * Protects routes that require authentication
 *
 * @example
 * // Redirect to login if not authenticated
 * <AuthGuard>
 *   <Dashboard />
 * </AuthGuard>
 *
 * @example
 * // Don't redirect, just show children (useful for optional auth)
 * <AuthGuard redirectToLogin={false}>
 *   <HomePage />
 * </AuthGuard>
 *
 * @example
 * // Custom redirect path
 * <AuthGuard redirectPath="/auth/sign-in">
 *   <Dashboard />
 * </AuthGuard>
 */
export function AuthGuard({
    children,
    redirectToLogin = true,
    redirectPath = "/auth/login",
    loadingComponent,
    allowUnauthenticated = false,
}: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        // Only redirect if:
        // 1. Not loading
        // 2. Not authenticated
        // 3. Redirect is enabled
        // 4. Not allowing unauthenticated access
        if (!isLoading && !isAuthenticated && redirectToLogin && !allowUnauthenticated) {
            // Store current path for redirect after login
            const currentPath = window.location.pathname;
            const searchParams = new URLSearchParams();

            if (currentPath !== "/" && currentPath !== redirectPath) {
                searchParams.set("redirectTo", currentPath);
            }

            const redirectUrl = searchParams.toString()
                ? `${redirectPath}?${searchParams.toString()}`
                : redirectPath;

            navigate(redirectUrl, { replace: true });
        }
    }, [isLoading, isAuthenticated, redirectToLogin, redirectPath, navigate, allowUnauthenticated]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {loadingComponent || (
                    <div className="flex flex-col items-center gap-4">
                        <Spinner className="h-8 w-8" />
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                )}
            </div>
        );
    }

    // If not authenticated and redirect is disabled, still show children
    if (!isAuthenticated && !redirectToLogin) {
        return <>{children}</>;
    }

    // If allowing unauthenticated access, show children regardless
    if (allowUnauthenticated) {
        return <>{children}</>;
    }

    // If authenticated, show children
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // Default: don't render anything (redirect will happen in useEffect)
    return null;
}

/**
 * Guest Guard Component
 * Redirects authenticated users away from auth pages
 * Opposite of AuthGuard
 *
 * @example
 * // Redirect to dashboard if already logged in
 * <GuestGuard>
 *   <LoginPage />
 * </GuestGuard>
 */
interface GuestGuardProps {
    children: ReactNode;
    /**
     * Where to redirect authenticated users
     * @default "/dashboard"
     */
    redirectPath?: string;
    /**
     * Custom loading component
     */
    loadingComponent?: ReactNode;
}

export function GuestGuard({
    children,
    redirectPath = "/dashboard",
    loadingComponent,
}: GuestGuardProps) {
    const { isAuthenticated, isLoading } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            // Check if there's a redirectTo param
            const searchParams = new URLSearchParams(window.location.search);
            const redirectTo = searchParams.get("redirectTo");

            navigate(redirectTo || redirectPath, { replace: true });
        }
    }, [isLoading, isAuthenticated, redirectPath, navigate]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {loadingComponent || (
                    <div className="flex flex-col items-center gap-4">
                        <Spinner className="h-8 w-8" />
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                )}
            </div>
        );
    }

    // If not authenticated, show children (login/register pages)
    if (!isAuthenticated) {
        return <>{children}</>;
    }

    // Default: don't render anything (redirect will happen in useEffect)
    return null;
}
