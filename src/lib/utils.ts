import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format hours to human-readable format
 * If less than 1 hour, show minutes (e.g., "30m")
 * If 1 hour or more, show hours and minutes (e.g., "1h 30m")
 */
export function formatWorkHours(hours: number): string {
  if (hours === 0) return "0m";

  const totalMinutes = Math.round(hours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hrs === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hrs}h`;
  }

  return `${hrs}h ${mins}m`;
}
