import { useSession } from "~/features/auth";
import type { Route } from "./+types/dashboard";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Dashboard" },
        { name: "description", content: "Welcome to the Dashboard!" },
    ];
}

export default function DashboardHome() {

    const { data } = useSession();
    console.log(data);

    return <h1>Welcome to the Dashboard Home!
        {data?.user ? ` Hello, ${data.user.name}` : " Please log in."}
    </h1>;
}