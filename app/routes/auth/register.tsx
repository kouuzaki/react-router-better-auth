import type { Route } from "./+types/register";
import RegisterRoute from "~/features/auth/routes/register";

export default function Register() {
    return <RegisterRoute />;
}

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Register - Create Account" },
        { name: "description", content: "Create your account" },
    ];
}
