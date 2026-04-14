import { cva } from 'class-variance-authority';

export const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-14',
      },
      variant: {
        brand: 'data-[state=checked]:bg-brand data-[state=unchecked]:bg-gray-200',
        danger: 'data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-gray-200',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'brand',
    },
  }
);

export const switchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-white shadow-md ring-0 transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        md: 'h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
        lg: 'h-6 w-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
