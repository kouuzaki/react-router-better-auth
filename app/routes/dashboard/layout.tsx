import { Outlet } from "react-router";
import { AuthGuard } from "~/components/auth/auth-guard";

export default function DashboardLayout() {
    return (
        <AuthGuard redirectToLogin={true} redirectPath="/auth/login">
            <div className="min-h-screen">
                <Outlet />
            </div>
        </AuthGuard>
    );
}
