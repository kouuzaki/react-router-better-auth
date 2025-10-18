import type { Route } from "./+types/register";
import RegisterRoute from "~/features/auth/routes/register";
import { AnimatedBeamCCTV } from "~/components/ui/animated-beam-cctv";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Register - Create Account" },
        { name: "description", content: "Create your account" },
    ];
}

export default function Register() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="w-full h-full grid lg:grid-cols-2 p-4">
                <RegisterRoute />
                <div className="bg-muted hidden lg:block rounded-lg border relative overflow-hidden">
                    <AnimatedBeamCCTV />
                </div>
            </div>
        </div>
    )
}

