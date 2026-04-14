import { cva } from 'class-variance-authority';

export const selectVariants = cva(
  'flex items-center w-full rounded-lg border bg-background transition-all duration-200 focus-within:border-brand outline-none relative',
  {
    variants: {
      state: {
        default: 'border-border text-foreground',
        error: 'border-red-500 text-red-500 focus-within:ring-red-500 focus-within:border-red-500',
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

export const selectInputVariants = cva(
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

export const selectContentVariants = cva(
  'z-50 overflow-hidden rounded-xl border border-border/60 bg-background/95 backdrop-blur-sm text-popover-foreground shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      size: {
        sm: 'p-1',
        md: 'p-1.5',
        lg: 'p-2',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const selectItemVariants = cva(
  'relative flex w-full cursor-default select-none items-center rounded-lg outline-none transition-all data-[highlighted]:bg-brand/10 data-[highlighted]:text-brand data-[state=checked]:bg-brand/10 data-[state=checked]:text-brand data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 px-2 text-xs gap-2',
        md: 'h-10 px-3 text-sm gap-2.5',
        lg: 'h-12 px-4 text-base gap-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const selectBadgeVariants = cva(
  'inline-flex items-center rounded bg-brand/10 text-brand gap-1 px-1.5 py-0.5 leading-none transition-all hover:bg-brand/20',
  {
    variants: {
      size: {
        sm: 'text-[10px] h-5',
        md: 'text-xs h-6',
        lg: 'text-sm h-7',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
