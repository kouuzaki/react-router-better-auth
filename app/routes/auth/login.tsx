import React from 'react'
import type { Route } from "./+types/login";
import LoginRoute from "~/features/auth/routes/login";
import { AnimatedBeamCCTV } from "~/components/ui/animated-beam-cctv";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Login Page" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Login() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="w-full h-full grid lg:grid-cols-2 p-4">
                <LoginRoute />
                <div className="bg-muted hidden lg:block rounded-lg border relative overflow-hidden">
                    <AnimatedBeamCCTV />
                </div>
            </div>
        </div>
    );
}

