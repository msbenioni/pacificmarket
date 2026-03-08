import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 

export const isIframe = typeof window !== "undefined" && window.self !== window.top;

// Simple tally function for counting occurrences
export const tally = (items, key) => {
  return items.reduce((acc, item) => {
    const value = item[key];
    if (value) {
      const existing = acc.find(item => item.label === value);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ label: value, value: 1 });
      }
    }
    return acc;
  }, []);
};
