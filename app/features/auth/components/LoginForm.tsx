"use client";

import { Button } from "~/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Checkbox } from "~/components/ui/checkbox";
import { AnimatedBeamNodes } from "~/components/ui/animated-beam-nodes";
import { cn } from "~/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { toast } from "sonner";

import { signInEmailSchema, type SignInEmailInput } from "../schema/auth.schema";
import { useSignIn, useSocialSignIn } from "../queries/auth-queries";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { LoginHeader } from "./LoginHeader";

export function LoginForm() {
    const navigate = useNavigate();
    const signInMutation = useSignIn();
    const socialSignInMutation = useSocialSignIn();

    const form = useForm<SignInEmailInput>({
        resolver: zodResolver(signInEmailSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: SignInEmailInput) => {
        try {
            console.log("Submitting", data);

            await signInMutation.mutateAsync(data);

            toast.success("Welcome back!", {
                description: "You have successfully signed in.",
            });

            navigate("/dashboard");
        } catch (error: any) {
            toast.error("Sign in failed", {
                description: signInMutation.error?.message || "Please check your credentials and try again.",
            });
        }
    };

    const handleSocialLogin = async (provider: string) => {
        try {
            socialSignInMutation.mutate(provider);
        } catch (error: any) {
            toast.error("Social sign in failed", {
                description: socialSignInMutation.error?.message || "Please try again.",
            });
        }
    };

    const isLoading = signInMutation.isPending || socialSignInMutation.isPending;

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="w-full h-full grid lg:grid-cols-2 p-4">
                <div className="max-w-xs m-auto w-full flex flex-col items-center">
                    <LoginHeader
                        icon={<GalleryVerticalEnd className="h-10 w-10 text-primary" />}
                        title="Log in to Your Account"
                        subtitle="Welcome back! Please enter your details"
                    />

                    <div className="mt-8 w-full flex items-center justify-center">
                        <SocialLoginButtons
                            onSocialLogin={handleSocialLogin}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="my-7 w-full flex items-center justify-center overflow-hidden">
                        <Separator />
                        <span className="text-sm px-2 text-muted-foreground">OR</span>
                        <Separator />
                    </div>

                    <Form {...form}>
                        <form
                            className="w-full space-y-4"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
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
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Password</FormLabel>
                                            <Link
                                                to="/auth/forgot-password"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your password"
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
                                name="rememberMe"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                            Remember me for 30 days
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-5">
                        <p className="text-sm text-center text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                to="/auth/register"
                                className="text-primary hover:underline font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="bg-muted hidden lg:block rounded-lg border relative overflow-hidden">
                    <AnimatedBeamNodes />
                </div>
            </div>
        </div>
    );
}
