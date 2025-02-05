import { type ClassValue, clsx } from "clsx"
import { DateTime } from 'luxon';
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Converts a date string to a timestamp using Luxon.
 * @param {string} dateString - The date string to convert.
 * @returns {number} The timestamp in milliseconds.
 */
export function getTimestamp(date: string) {
    return DateTime.fromISO(date).toMillis();
}