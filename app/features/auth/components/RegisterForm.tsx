import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { AnimatedBeamNodes } from "~/components/ui/animated-beam-nodes";
import { cn } from "~/lib/utils";

import { signUpEmailSchema, type SignUpEmailInput } from "../schema/auth.schema";
import { useSignUp, useSocialSignIn } from "../queries/auth-queries";
import { LoginHeader } from "./LoginHeader";
import { SocialLoginButtons } from "./SocialLoginButtons";

export function RegisterForm() {
  const navigate = useNavigate();
  const signUpMutation = useSignUp();
  const socialSignInMutation = useSocialSignIn();

  const form = useForm<SignUpEmailInput>({
    resolver: zodResolver(signUpEmailSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      callbackURL: "/dashboard",
    },
  });

  const onSubmit = async (data: SignUpEmailInput) => {
    try {
      await signUpMutation.mutateAsync(data);

      toast.success("Account created!", {
        description: "Welcome! Your account has been created successfully.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Registration failed", {
        description: signUpMutation.error?.message || "Please try again.",
      });
    }
  };

  const handleSocialLogin = (provider: string) => {
    socialSignInMutation.mutate(provider);
  };

  const isLoading = signUpMutation.isPending || socialSignInMutation.isPending;

  return (
    <div className="max-w-xs m-auto w-full flex flex-col items-center">
      <LoginHeader
        icon={<UserPlus className="h-10 w-10 text-primary" />}
        title="Create Your Account"
        subtitle="Join us today! Please fill in your details."
      />

      <SocialLoginButtons onSocialLogin={handleSocialLogin} isLoading={isLoading} />

      <div className="my-7 w-full flex items-center justify-center overflow-hidden">
        <Separator />
        <span className="text-sm px-2">OR</span>
        <Separator />
      </div>

      <Form {...form}>
        <form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </Form>

      <div className="mt-5">
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="underline text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
