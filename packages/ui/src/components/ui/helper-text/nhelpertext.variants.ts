import { cva } from 'class-variance-authority';

export const helperTextVariants = cva(
  'transition-all duration-200',
  {
    variants: {
      state: {
        default: 'text-gray-500',
        error: 'text-red-500',
      },
      size: {
        sm: 'text-[10px] mt-0.5',
        md: 'text-xs mt-1',
        lg: 'text-sm mt-1.5',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'md',
    },
  }
);
