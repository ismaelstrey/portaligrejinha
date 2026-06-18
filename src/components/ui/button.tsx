import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-primary)] px-5 py-3 text-white hover:bg-[var(--color-primary-strong)]",
        secondary:
          "bg-white px-5 py-3 text-[var(--color-foreground)] ring-1 ring-[var(--color-border)] hover:bg-[var(--color-soft)]",
        ghost: "px-4 py-2 text-[var(--color-foreground)] hover:bg-[var(--color-soft)]"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
