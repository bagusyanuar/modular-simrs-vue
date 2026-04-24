import { cva } from 'class-variance-authority';

export const alertVariants = cva(
  'flex items-start gap-ns-4 w-80 px-ns-5 py-ns-4 rounded-nr-3 min-h-16',
  {
    variants: {
      type: {
        info: 'bg-primary-50 border border-primary-700',
        error: '',
        success: '',
      },
    },
    defaultVariants: {
      type: 'info',
    },
  }
);
