import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine multiple class names into a single string.
 *
 * @param inputs
 * @returns string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
