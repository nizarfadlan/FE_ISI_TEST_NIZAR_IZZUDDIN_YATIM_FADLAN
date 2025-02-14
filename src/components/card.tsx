import { cn } from "@/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva("bg-white text-black", {
  variants: {
    shadow: {
      default: "no-shadow",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
      "2xl": "shadow-2xl",
      "3xl": "shadow-3xl",
      inner: "shadow-inner",
    },
    border: {
      default: "border",
      none: "border-none",
    },
    rounded: {
      default: "rounded-md",
      sm: "rounded-sm",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      full: "rounded-full",
      none: "rounded-none",
    },
  },
  defaultVariants: {
    shadow: "sm",
    border: "default",
    rounded: "lg",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title: string;
  description?: string;
  children?: React.ReactNode;
  childrenFooter?: React.ReactNode;
}

export function Card({
  className,
  shadow,
  border,
  rounded,
  title,
  description,
  children,
  childrenFooter,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ shadow, border, rounded, className }))}
      {...props}
    >
      <div className="p-6 pt-0">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        {children}
        {childrenFooter && (
          <div className="flex items-center p-6 pt-0">{childrenFooter}</div>
        )}
      </div>
    </div>
  );
}
