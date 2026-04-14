import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-normal transition-all duration-300 ease-in-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        primary:
          'bg-brand border border-brand text-brand-foreground hover:bg-brand-hover hover:border-brand-hover',
        outline:
          'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400',
        ghost: 'bg-transparent border-none text-gray-600 hover:bg-gray-100',
      },
      size: {
        sm: 'h-8 px-3 text-xs gap-1',
        md: 'h-10 px-4 py-2 gap-2',
        lg: 'h-12 px-6 text-base gap-3',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
