import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple simulation of clsx/twMerge if libraries were missing in environment, 
// but assuming user has standard react utils. 
// For this demo, we implement a basic version if imports fail (which they wont in a real setup)
// but we stick to standard "cn" pattern.
