import * as React from "react";
import { OTPInput } from "input-otp";
import {
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "~/components/ui/input-otp";
import { cn } from "~/lib/utils";

interface InputOTPSharedProps {
    maxLength?: number;
    className?: string;
    containerClassName?: string;
    groupClassName?: string;
    slotClassName?: string;
    separatorClassName?: string;
    separator?: React.ReactNode;
    groups?: Array<{
        slots: number;
        className?: string;
    }>;
}

export type { InputOTPSharedProps };

export function InputOTPShared({
    maxLength = 6,
    className,
    containerClassName,
    groupClassName,
    slotClassName,
    separatorClassName,
    separator,
    groups = [
        { slots: 3, className: "space-x-1" },
        { slots: 3, className: "space-x-1" },
    ],
    ...props
}: InputOTPSharedProps & Omit<React.ComponentProps<typeof OTPInput>, "maxLength" | "children" | "render">) {
    const totalSlots = groups.reduce((acc, group) => acc + group.slots, 0);
    const actualMaxLength = Math.min(maxLength, totalSlots);

    let currentIndex = 0;

    return (
        <OTPInput
            maxLength={actualMaxLength}
            containerClassName={cn(
                "flex items-center gap-2 has-disabled:opacity-50",
                containerClassName
            )}
            className={cn("disabled:cursor-not-allowed", className)}
            {...props}
        >
            {groups.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                    <InputOTPGroup className={cn(groupClassName, group.className)}>
                        {Array.from({ length: group.slots }, (_, slotIndex) => (
                            <InputOTPSlot
                                key={slotIndex}
                                index={currentIndex++}
                                className={slotClassName}
                            />
                        ))}
                    </InputOTPGroup>
                    {groupIndex < groups.length - 1 && (
                        <InputOTPSeparator className={separatorClassName}>
                            {separator}
                        </InputOTPSeparator>
                    )}
                </React.Fragment>
            ))}
        </OTPInput>
    );
}

// Helper function to create common variants
export function InputOTPDefault(props: Omit<InputOTPSharedProps, "groups">) {
    return (
        <InputOTPShared
            groups={[
                { slots: 3, className: "space-x-1" },
                { slots: 3, className: "space-x-1" },
            ]}
            slotClassName="rounded-md border-l"
            {...props}
        />
    );
}

export function InputOTPCompact(props: Omit<InputOTPSharedProps, "groups">) {
    return (
        <InputOTPShared
            groups={[{ slots: 6, className: "space-x-1" }]}
            slotClassName="rounded-md"
            {...props}
        />
    );
}

export function InputOTPEmail(props: Omit<InputOTPSharedProps, "groups">) {
    return (
        <InputOTPShared
            maxLength={6}
            groups={[
                { slots: 3, className: "space-x-1" },
                { slots: 3, className: "space-x-1" },
            ]}
            slotClassName="rounded-md border-l"
            separator={<span className="text-muted-foreground">-</span>}
            {...props}
        />
    );
}