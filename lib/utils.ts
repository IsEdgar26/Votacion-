import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combina clsx y tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}