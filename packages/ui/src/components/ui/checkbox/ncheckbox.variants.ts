import { cva } from 'class-variance-authority';

export const checkboxVariants = cva(
  'inline-flex shrink-0 flex-none appearance-none items-center justify-center rounded border border-solid border-gray-400 bg-transparent outline-none transition-all focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: '!w-4 !h-4',
        md: '!w-5 !h-5',
        lg: '!w-6 !h-6',
      },
      error: {
        true: 'border-red-500 focus-visible:ring-red-500',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  }
);
