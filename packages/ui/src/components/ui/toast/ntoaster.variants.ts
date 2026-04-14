import { cva } from 'class-variance-authority';

export const toasterVariants = cva('toaster group', {
  variants: {
    theme: {
      light: 'light',
      dark: 'dark',
      system: 'system',
    },
  },
  defaultVariants: {
    theme: 'light',
  },
});

export const toastClasses = {
  toast:
    'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:px-4 group-[.toaster]:py-3 group-[.toaster]:font-sans',
  description: 'group-[.toast]:text-gray-500 group-[.toast]:text-xs',
  actionButton:
    'group-[.toast]:bg-brand group-[.toast]:text-brand-foreground group-[.toast]:font-medium group-[.toast]:rounded-md group-[.toast]:px-2 group-[.toast]:py-1 group-[.toast]:text-xs',
  cancelButton:
    'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500 group-[.toast]:font-medium group-[.toast]:rounded-md group-[.toast]:px-2 group-[.toast]:py-1 group-[.toast]:text-xs',
  closeButton:
    'group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border-border',
  success: 'group-[.toaster]:text-green-600 group-[.toaster]:border-green-200 group-[.toaster]:bg-green-50',
  error: 'group-[.toaster]:text-red-600 group-[.toaster]:border-red-200 group-[.toaster]:bg-red-50',
  warning: 'group-[.toaster]:text-yellow-600 group-[.toaster]:border-yellow-200 group-[.toaster]:bg-yellow-50',
  info: 'group-[.toaster]:text-blue-600 group-[.toaster]:border-blue-200 group-[.toaster]:bg-blue-50',
};
