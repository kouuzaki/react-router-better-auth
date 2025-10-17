import React from 'react'
import type { Route } from "./+types/login";
import LoginRoute from "~/features/auth/routes/login";

export default function Login() {
    return <LoginRoute />;
}

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Login Page" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}
