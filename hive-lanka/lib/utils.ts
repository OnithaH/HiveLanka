import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits:  2,
  }).format(price);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}