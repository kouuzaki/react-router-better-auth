
import { GithubIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { SocialProvider } from "../types";

interface SocialLoginButtonsProps {
    onSocialLogin: (provider: SocialProvider) => void;
    isLoading?: boolean;
}

export function SocialLoginButtons({
    onSocialLogin,
    isLoading,
}: SocialLoginButtonsProps) {
    return (
        <div className="flex items-center gap-3 w-full">
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={() => onSocialLogin("github")}
                disabled={isLoading}
            >
                <GithubIcon className="h-[18px] w-[18px]" />
            </Button>
            {/* Add more social providers as needed */}
        </div>
    );
}
