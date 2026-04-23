import { cva } from 'class-variance-authority';

export const typographyVariants = cva('', {
  variants: {
    variant: {
      'heading-1': 'text-[1.5rem] font-medium leading-[1.2]',
      'heading-2': 'text-[1.125rem] font-medium leading-[1.2]',
      'subtitle-md': 'text-[1rem] font-medium leading-[1.2]',
      'subtitle-sm': 'text-[0.875rem] font-medium leading-[1.2]',
      'body-lg': 'text-[1rem] font-normal leading-[1.4]',
      'body-lg-medium': 'text-[1rem] font-medium leading-[1.4]',
      'body-md': 'text-[0.875rem] font-normal leading-[1.4]',
      'body-md-medium': 'text-[0.875rem] font-medium leading-[1.4]',
      'body-sm': 'text-[0.75rem] font-normal leading-[1.4]',
      'body-sm-medium': 'text-[0.75rem] font-medium leading-[1.4]',
      'body-xs': 'text-[0.625rem] font-normal leading-[1.4]',
      'body-xs-medium': 'text-[0.625rem] font-medium leading-[1.4]',
    },
  },
});
