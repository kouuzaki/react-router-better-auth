import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // Status badges with colored dots
        "status-in-progress":
          "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full",
        "status-blocked":
          "bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full",
        "status-done":
          "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full",
        "status-online":
          "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full",
        "status-offline":
          "bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full",
        "status-maintenance":
          "bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/10 text-blue-500 border-blue-600/60 shadow-none rounded-full",
        "status-degraded":
          "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full",
        // Soft badges (same as status but without dots in the variant)
        "soft-amber":
          "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 shadow-none rounded-full",
        "soft-red":
          "bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 shadow-none rounded-full",
        "soft-emerald":
          "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 shadow-none rounded-full",
        // Icon variants
        "with-icon-left":
          "rounded-full pl-1 gap-1.5",
        "with-icon-right":
          "rounded-full pr-1 gap-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
