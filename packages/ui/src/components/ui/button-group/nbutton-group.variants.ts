import { cva, type VariantProps } from 'class-variance-authority';

export const buttonGroupVariants = cva(
  'inline-flex items-center justify-center rounded-md overflow-hidden',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
);

export type ButtonGroupVariants = VariantProps<typeof buttonGroupVariants>;
