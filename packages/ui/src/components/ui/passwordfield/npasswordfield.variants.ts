import { cva } from 'class-variance-authority';

export const passwordfieldVariants = cva(
  'flex items-center w-full rounded-lg border bg-background transition-all duration-200 focus-within:border-brand outline-none',
  {
    variants: {
      state: {
        default: 'border-border text-foreground',
        error:
          'border-red-500 text-red-500 focus-within:ring-red-500 focus-within:border-red-500',
        disabled: 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-70',
      },
      size: {
        sm: 'h-8 px-2 gap-1',
        md: 'h-10 px-3 gap-2',
        lg: 'h-12 px-4 gap-3',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'md',
    },
  }
);

export const inputVariants = cva(
  'block w-full flex-1 min-w-0 h-full appearance-none bg-transparent border-0 p-0 m-0 outline-none focus:ring-0 focus:outline-none placeholder:text-gray-400 disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
