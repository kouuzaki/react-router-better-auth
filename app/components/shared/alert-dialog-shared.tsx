import * as React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { OctagonAlert, CircleFadingArrowUp, Rocket } from "lucide-react";

export type AlertDialogVariant = "destructive" | "info";

export interface AlertDialogSharedProps {
    variant: AlertDialogVariant;
    trigger: React.ReactNode;
    title: string;
    description: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    // For info variant
    badges?: string[];
    // For destructive variant
    centered?: boolean;
}

const variantConfig = {
    destructive: {
        icon: OctagonAlert,
        iconClass: "h-7 w-7 text-destructive",
        bgClass: "bg-destructive/10",
        actionVariant: "destructive" as const,
        headerClass: "items-center",
        footerClass: "mt-2 sm:justify-center",
    },
    info: {
        icon: CircleFadingArrowUp,
        iconClass: "h-[18px] w-[18px] text-primary",
        bgClass: "bg-primary/10",
        actionVariant: "default" as const,
        headerClass: "",
        footerClass: "mt-4",
    },
};

export function AlertDialogShared({
    variant,
    trigger,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText,
    cancelText = "Cancel",
    badges,
    centered = false,
}: AlertDialogSharedProps) {
    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader className={config.headerClass}>
                    {variant === "destructive" && centered && (
                        <AlertDialogTitle>
                            <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                                <OctagonAlert className="h-7 w-7 text-destructive" />
                            </div>
                            {title}
                        </AlertDialogTitle>
                    )}
                    {variant === "info" && (
                        <>
                            <div className="mx-auto sm:mx-0 mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                <CircleFadingArrowUp className="h-[18px] w-[18px] text-primary" />
                            </div>
                            <AlertDialogTitle className="text-2xl font-bold tracking-tight">
                                {title}
                            </AlertDialogTitle>
                        </>
                    )}
                    {variant === "destructive" && !centered && (
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                    )}
                    <AlertDialogDescription
                        className={`text-[15px] ${variant === "destructive" && centered ? "text-center" : ""
                            } ${variant === "info" ? "mt-3!" : ""}`}
                    >
                        {description}
                    </AlertDialogDescription>
                    {variant === "info" && badges && (
                        <div className="mt-6! flex flex-wrap gap-2">
                            {badges.map((badge, index) => (
                                <Badge key={index} variant="outline" className="py-1">
                                    {badge}
                                </Badge>
                            ))}
                        </div>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter className={config.footerClass}>
                    <AlertDialogCancel onClick={onCancel}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={
                            variant === "destructive"
                                ? buttonVariants({ variant: "destructive" })
                                : ""
                        }
                    >
                        {variant === "info" && <Rocket className="mr-2 h-4 w-4" />}
                        {confirmText || "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// Convenience components for specific variants
export function AlertDialogDestructive({
    trigger,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    centered = true,
}: Omit<AlertDialogSharedProps, "variant" | "badges">) {
    return (
        <AlertDialogShared
            variant="destructive"
            trigger={trigger}
            title={title}
            description={description}
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmText={confirmText}
            cancelText={cancelText}
            centered={centered}
        />
    );
}

export function AlertDialogInfo({
    trigger,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText = "Update Now",
    cancelText,
    badges,
}: Omit<AlertDialogSharedProps, "variant" | "centered">) {
    return (
        <AlertDialogShared
            variant="info"
            trigger={trigger}
            title={title}
            description={description}
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmText={confirmText}
            cancelText={cancelText}
            badges={badges}
        />
    );
}