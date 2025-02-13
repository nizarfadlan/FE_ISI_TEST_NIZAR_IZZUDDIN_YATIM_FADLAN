import { cn } from "@/utils";

interface LoadingProps {
  text?: string | undefined;
  className?: string;
  size?: "small" | "medium" | "large";
  classNameSVG?: string;
}

export default function Loading({
  text,
  className,
  size = "small",
  classNameSVG,
}: LoadingProps) {
  return (
    <div
      role="status"
      className={cn("flex items-center justify-center text-white", className)}
    >
      <svg
        className={cn("animate-spin", classNameSVG, text ? "-ml-1 mr-3" : "", {
          "h-5 w-5": size === "small",
          "h-7 w-7": size === "medium",
          "h-10 w-10": size === "large",
        })}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>{text}</span>
    </div>
  );
}
