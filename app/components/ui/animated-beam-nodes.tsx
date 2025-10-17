import React, { forwardRef, useRef } from "react";
import { cn } from "~/lib/utils";
import { AnimatedBeam } from "~/components/ui/animation-beam";

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900 p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
                className,
            )}
        >
            {children}
        </div>
    );
});
Circle.displayName = "Circle";

const BlockNodeIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        xmlns="http://www.w3.org/2000/svg"
        className="text-slate-900 dark:text-white"
    >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

export function AnimatedBeamNodes() {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div5Ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className="relative flex w-full items-center justify-center overflow-hidden p-10"
            ref={containerRef}
        >
            <div className="flex size-full flex-col items-stretch justify-between gap-10">
                {/* Top row */}
                <div className="flex flex-row justify-between">
                    <Circle ref={div1Ref}>
                        <BlockNodeIcon />
                    </Circle>
                    <Circle ref={div2Ref}>
                        <BlockNodeIcon />
                    </Circle>
                </div>

                {/* Middle */}
                <div className="flex justify-center">
                    <Circle ref={div5Ref}>
                        <BlockNodeIcon />
                    </Circle>
                </div>

                {/* Bottom row */}
                <div className="flex flex-row justify-between">
                    <Circle ref={div3Ref}>
                        <BlockNodeIcon />
                    </Circle>
                    <Circle ref={div4Ref}>
                        <BlockNodeIcon />
                    </Circle>
                </div>
            </div>

            {/* Animated beams connecting nodes */}
            <AnimatedBeam
                duration={3}
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div5Ref}
                gradientStartColor="#3b82f6"
                gradientStopColor="#8b5cf6"
            />
            <AnimatedBeam
                duration={3}
                delay={0.5}
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div5Ref}
                gradientStartColor="#8b5cf6"
                gradientStopColor="#3b82f6"
            />
            <AnimatedBeam
                duration={3}
                delay={1}
                containerRef={containerRef}
                fromRef={div5Ref}
                toRef={div3Ref}
                reverse
                gradientStartColor="#3b82f6"
                gradientStopColor="#8b5cf6"
            />
            <AnimatedBeam
                duration={3}
                delay={1.5}
                containerRef={containerRef}
                fromRef={div5Ref}
                toRef={div4Ref}
                reverse
                gradientStartColor="#8b5cf6"
                gradientStopColor="#3b82f6"
            />
        </div>
    );
}
