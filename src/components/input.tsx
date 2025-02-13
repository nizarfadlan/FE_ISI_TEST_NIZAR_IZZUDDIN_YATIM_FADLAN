import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const inputVariants = cva(
  "flex w-full border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "focus-visible:ring-ring",
        "ring-primary": "focus-visible:ring-primary",
      },
      size: {
        sm: "h-10 rounded-lg px-3 py-2",
        default: "h-11 rounded-lg px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
