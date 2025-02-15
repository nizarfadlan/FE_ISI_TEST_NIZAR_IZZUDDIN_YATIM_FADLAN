import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ClientError } from "./error";

/**
 * Combine multiple class names into a single string.
 *
 * @param inputs
 * @returns string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

export function encodeCursor(value: string): string {
  return btoa(value);
}

export function decodeCursor(cursor: string): number {
  try {
    const decoded = atob(cursor) as unknown as number;
    return decoded;
  } catch {
    throw new ClientError("Invalid cursor", 400);
  }
}
