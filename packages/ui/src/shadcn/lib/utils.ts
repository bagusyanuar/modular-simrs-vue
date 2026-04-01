import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fungsi 'cn' (class name) untuk menggabungkan class Tailwind
 * dan menangani konflik class secara otomatis.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
