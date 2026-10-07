import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactNumber(num: number): string {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + ' Cr';
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + ' Lakh';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'k';
  }
  return num.toString();
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}
