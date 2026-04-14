import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer transition-all duration-300 ease-in-out disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-orange-500 border border-orange-500 text-white hover:bg-orange-600 hover:border-orange-600',
        outline:
          'bg-transparent border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white',
        ghost:
          'bg-transparent border-none text-gray-500 hover:bg-gray-500 hover:text-white',
      },
    },
  }
);
