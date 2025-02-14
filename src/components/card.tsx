import { cn } from "@/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { Button, type ButtonProps } from "./button";

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
    rounded: "xl",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title: string;
  description?: string;
  children?: React.ReactNode;
  childrenFooter?: React.ReactNode;
  positionButton?: "left" | "right";
  IconButton?: LucideIcon;
  textButton?: string;
  colorVariantButton?: ButtonProps["variant"];
  anotherChildHeader?: React.ReactNode;
  callbackButton?: () => void;
}

export function Card({
  className,
  shadow,
  border,
  rounded,
  title,
  description,
  positionButton = "right",
  IconButton,
  textButton,
  colorVariantButton = "default",
  anotherChildHeader,
  callbackButton,
  children,
  childrenFooter,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ shadow, border, rounded, className }))}
      {...props}
    >
      <div className="p-6">
        <div
          className={cn(
            "flex flex-col space-y-1.5",
            "flex items-center max-sm:space-y-2 sm:space-y-0",
            positionButton === "left"
              ? "flex-row-reverse flex-wrap-reverse justify-end"
              : "flex-row flex-wrap justify-between",
          )}
        >
          <div className="space-y-1.5">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
          {textButton || IconButton || anotherChildHeader ? (
            <div
              className={anotherChildHeader ? "flex flex-row space-x-2" : ""}
            >
              <Button
                variant={colorVariantButton}
                onClick={callbackButton}
                className={cn(
                  "px-4 py-4 sm:px-4 sm:py-3",
                  positionButton === "left" ? "mr-4" : "",
                )}
                type="button"
              >
                {IconButton && <IconButton />}
                {textButton && (
                  <span className={IconButton && "hidden sm:block"}>
                    {textButton}
                  </span>
                )}
              </Button>
              {anotherChildHeader && anotherChildHeader}
            </div>
          ) : null}
        </div>
        <div className="py-4">{children}</div>
        {childrenFooter && (
          <div className="flex items-center p-6 pt-0">{childrenFooter}</div>
        )}
      </div>
    </div>
  );
}
