import { Outlet } from "react-router";
import { GuestGuard } from "~/components/auth/auth-guard";

export default function AuthLayout() {
    return (
        <GuestGuard redirectPath="/dashboard">
            <Outlet />
        </GuestGuard>
    );
}
