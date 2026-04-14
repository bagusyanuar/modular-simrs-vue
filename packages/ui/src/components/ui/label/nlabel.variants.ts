import { cva } from 'class-variance-authority';

export const labelVariants = cva(
  'font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      size: {
        sm: 'text-xs mb-1',
        md: 'text-sm mb-1.5',
        lg: 'text-base mb-2',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
