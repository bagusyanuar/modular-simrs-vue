import { cva } from 'class-variance-authority';

export const sidebarVariants = cva(
  'relative shrink-0 h-full transition-all duration-300 ease-in-out flex flex-col pt-5 pb-5 pl-4 pr-0',
  {
    variants: {
      collapsed: {
        true: 'w-24',
        false: 'w-64',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
);

export const sidebarItemVariants = cva(
  'group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer',
  {
    variants: {
      active: {
        true: 'bg-brand text-brand-foreground shadow-lg shadow-brand/20',
        false: 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
      },
      collapsed: {
        true: 'justify-center w-12 mx-auto px-0',
        false: 'w-full',
      },
    },
    defaultVariants: {
      active: false,
      collapsed: false,
    },
  }
);

export const sidebarGroupVariants = cva('flex flex-col gap-0.5 px-3', {
  variants: {
    collapsed: {
      true: 'px-2 items-center',
      false: '',
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

export const sidebarMenuSubVariants = cva(
  'flex flex-col gap-1 ml-4 pl-4 border-l border-gray-100 mt-1 overflow-hidden transition-all',
  {
    variants: {
      collapsed: {
        true: 'hidden',
        false: 'flex',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
);
