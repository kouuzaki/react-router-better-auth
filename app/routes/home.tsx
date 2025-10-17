import { ModeToggle } from "~/components/ui/custom/mode-toggle";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { useAuthContext } from "~/lib/auth-context";
import { useSignIn, useSignUp, useSignOut } from "~/features/auth/queries/auth-queries";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { AuthGuard } from "~/components/auth/auth-guard";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Home - React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const signOutMutation = useSignOut();
  const navigate = useNavigate();

  const onSignIn = async () => {
    try {
      await signInMutation.mutateAsync({
        email: "bayuputraefendi993@gmail.com",
        password: "!Bayu1234",
        callbackURL: "/dashboard",
      });

      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(signInMutation.error?.message || "Failed to sign in");
    }
  };

  const onSignUp = async () => {
    try {
      await signUpMutation.mutateAsync({
        email: "bayuputraefendi993@gmail.com",
        password: "!Bayu1234",
        confirmPassword: "!Bayu1234", // Add this line
        name: "Bayu Putra Efendi",
        callbackURL: "/dashboard",
      });

      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(signUpMutation.error?.message || "Failed to create account");
    }
  };

  const onSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
      toast.success("Signed out successfully!");
    } catch (error) {
      toast.error(signOutMutation.error?.message || "Failed to sign out");
    }
  };

  const isProcessing =
    signInMutation.isPending || signUpMutation.isPending || signOutMutation.isPending;

  return (
    <AuthGuard redirectToLogin={false} allowUnauthenticated={true}>
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Welcome to React Router</h1>
          <p className="text-muted-foreground">
            {isLoading
              ? "Loading..."
              : isAuthenticated
                ? `Logged in as: ${user?.email}`
                : "You are not logged in"}
          </p>
        </div>

        <div className="flex gap-3">
          {!isAuthenticated ? (
            <>
              <Button onClick={onSignIn} disabled={isProcessing}>
                {signInMutation.isPending ? "Signing in..." : "Login"}
              </Button>
              <Button variant="outline" onClick={onSignUp} disabled={isProcessing}>
                {signUpMutation.isPending ? "Signing up..." : "Sign Up"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="default" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button variant="ghost" onClick={onSignOut} disabled={isProcessing}>
                {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
              </Button>
            </>
          )}
        </div>

        {isAuthenticated && user && (
          <div className="mt-4 p-4 border rounded-lg space-y-2 max-w-md">
            <h3 className="font-semibold">User Info:</h3>
            <p className="text-sm">
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email Verified:</span>{" "}
              {user.emailVerified ? "Yes" : "No"}
            </p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
