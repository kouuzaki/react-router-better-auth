import React, { forwardRef, useRef } from "react";
import { cn } from "~/lib/utils";
import { AnimatedBeam } from "~/components/ui/animation-beam";
import {
    Camera,
    Target,
    Radio,
    Clapperboard,
    Brain,
    CctvIcon
} from "lucide-react";
import { RainbowButton } from "~/components/ui/rainbow-button";

/**
 * AnimatedBeamCCTV Component
 * 
 * A beautiful visualization of CCTV AI distribution system with:
 * - Rainbow Button nodes with animated gradient borders
 * - Shadcn UI theme colors (no hardcoded colors)
 * - Gradient variants in AnimatedBeam connections
 * - Dark mode support with automatic color switching
 * 
 * Architecture:
 * Video Sources (Cameras) → AI Core Processor → AI Add-ons (Detection, Tracking, Studio Training)
 * 
 * @example
 * ```tsx
 * <AnimatedBeamCCTV showLabels={true} animationSpeed={2.5} />
 * ```
 */

// Node Circle Component with Rainbow Button
const Circle = forwardRef<
    HTMLButtonElement,
    {
        className?: string;
        children?: React.ReactNode;
        label?: string;
    }
>(({ className, children, label }, ref) => {
    return (
        <div className="flex flex-col items-center gap-3">
            <RainbowButton
                ref={ref}
                variant="default"
                size="icon"
                className={cn(
                    "size-14 p-0 flex items-center justify-center rounded-full",
                    "bg-[linear-gradient(#0a0a0a,#0a0a0a),linear-gradient(#0a0a0a_50%,rgba(10,10,10,0.6)_80%,rgba(10,10,10,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]",
                    "bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box]",
                    "[border:calc(0.125rem)_solid_transparent]",
                    "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5",
                    "before:-translate-x-1/2 before:animate-rainbow",
                    "before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]",
                    "before:[filter:blur(0.75rem)]",
                    className
                )}
                aria-label={label || "Node button"}
            >
                {children}
            </RainbowButton>
            {label && (
                <span className="text-xs font-medium text-center text-muted-foreground max-w-[80px]">
                    {label}
                </span>
            )}
        </div>
    );
});
Circle.displayName = "Circle";

interface NodeConfig {
    ref: React.RefObject<HTMLButtonElement | null>;
    icon: React.ReactNode;
    label: string;
}

interface AnimatedBeamCCTVProps {
    showLabels?: boolean;
    animationSpeed?: number;
}

export function AnimatedBeamCCTV({ showLabels = true, animationSpeed = 2 }: AnimatedBeamCCTVProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // CCTV Camera Sources (Left side)
    const camera1Ref = useRef<HTMLButtonElement>(null);
    const camera2Ref = useRef<HTMLButtonElement>(null);

    // Processing/AI Core (Center)
    const aiCoreRef = useRef<HTMLButtonElement>(null);

    // AI Features (Right side - Detection, Tracking, Studio)
    const detectionRef = useRef<HTMLButtonElement>(null);
    const trackingRef = useRef<HTMLButtonElement>(null);
    const studioRef = useRef<HTMLButtonElement>(null);

    const nodes: Record<string, NodeConfig> = {
        camera1: {
            ref: camera1Ref,
            icon: <CctvIcon className="size-6  text-secondary" strokeWidth={1.5} />,
            label: "CCTV Camera 1",
        },
        camera2: {
            ref: camera2Ref,
            icon: <CctvIcon className="size-6  text-secondary" strokeWidth={1.5} />,
            label: "CCTV Camera 2",
        },
        aiCore: {
            ref: aiCoreRef,
            icon: <Brain className="size-7  text-secondary" strokeWidth={1.5} />,
            label: "AI Core Processor",
        },
        detection: {
            ref: detectionRef,
            icon: <Target className="size-6  text-secondary" strokeWidth={1.5} />,
            label: "Detection Add-on",
        },
        tracking: {
            ref: trackingRef,
            icon: <Radio className="size-6  text-secondary" strokeWidth={1.5} />,
            label: "Tracking Add-on",
        },
        studio: {
            ref: studioRef,
            icon: <Clapperboard className="size-6  text-secondary" strokeWidth={1.5} />,
            label: "Studio Training",
        },
    };

    return (
        <div
            className="relative flex w-full items-center justify-center overflow-hidden p-10 rounded-lg"
            ref={containerRef}
        >
            <div className="flex w-full flex-col gap-16">
                {/* Title/Header */}
                <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-foreground">
                        CCTV AI Distribution System
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Video streams → AI Processing → Multiple AI Add-ons
                    </p>
                </div>

                {/* Main Layout */}
                <div className="flex justify-between items-center px-8 z-10">
                    {/* Left: CCTV Cameras */}
                    <div className="flex flex-col gap-8 items-center">
                        <div className="text-center mb-2">
                            <span className="text-xs font-semibold text-primary">VIDEO SOURCES</span>
                        </div>
                        <Circle
                            ref={nodes.camera1.ref}
                            label={showLabels ? nodes.camera1.label : undefined}
                        >
                            {nodes.camera1.icon}
                        </Circle>
                        <Circle
                            ref={nodes.camera2.ref}
                            label={showLabels ? nodes.camera2.label : undefined}
                        >
                            {nodes.camera2.icon}
                        </Circle>
                    </div>

                    {/* Center: AI Core */}
                    <div className="flex flex-col items-center gap-4 z-10">
                        <div className="text-center mb-2">
                            <span className="text-xs font-semibold text-primary">AI CORE</span>
                        </div>
                        <div className="relative">
                            <Circle
                                ref={nodes.aiCore.ref}
                                label={showLabels ? nodes.aiCore.label : undefined}
                                className="size-16"
                            >
                                {nodes.aiCore.icon}
                            </Circle>
                        </div>
                    </div>

                    {/* Right: AI Features */}
                    <div className="flex flex-col gap-8 items-center z-10">
                        <div className="text-center mb-2">
                            <span className="text-xs font-semibold text-primary">AI ADD-ONS</span>
                        </div>
                        <Circle
                            ref={nodes.detection.ref}
                            label={showLabels ? nodes.detection.label : undefined}
                        >
                            {nodes.detection.icon}
                        </Circle>
                        <Circle
                            ref={nodes.tracking.ref}
                            label={showLabels ? nodes.tracking.label : undefined}
                        >
                            {nodes.tracking.icon}
                        </Circle>
                        <Circle
                            ref={nodes.studio.ref}
                            label={showLabels ? nodes.studio.label : undefined}
                        >
                            {nodes.studio.icon}
                        </Circle>
                    </div>
                </div>
            </div>

            {/* Animated Beams - Cameras to AI Core with gradient variants */}
            <AnimatedBeam
                duration={animationSpeed}
                containerRef={containerRef}
                fromRef={nodes.camera1.ref}
                toRef={nodes.aiCore.ref}
                gradientStartColor="var(--color-1)"
                gradientStopColor="var(--color-2)"
            />
            <AnimatedBeam
                duration={animationSpeed}
                delay={0.3}
                containerRef={containerRef}
                fromRef={nodes.camera2.ref}
                toRef={nodes.aiCore.ref}
                gradientStartColor="var(--color-2)"
                gradientStopColor="var(--color-3)"
            />

            {/* Animated Beams - AI Core to Add-ons with gradient variants */}
            <AnimatedBeam
                duration={animationSpeed}
                delay={0.6}
                containerRef={containerRef}
                fromRef={nodes.aiCore.ref}
                toRef={nodes.detection.ref}
                gradientStartColor="var(--color-3)"
                gradientStopColor="var(--color-4)"
            />
            <AnimatedBeam
                duration={animationSpeed}
                delay={0.9}
                containerRef={containerRef}
                fromRef={nodes.aiCore.ref}
                toRef={nodes.tracking.ref}
                gradientStartColor="var(--color-4)"
                gradientStopColor="var(--color-5)"
            />
            <AnimatedBeam
                duration={animationSpeed}
                delay={1.2}
                containerRef={containerRef}
                fromRef={nodes.aiCore.ref}
                toRef={nodes.studio.ref}
                gradientStartColor="var(--color-5)"
                gradientStopColor="var(--color-1)"
            />
        </div>
    );
}
