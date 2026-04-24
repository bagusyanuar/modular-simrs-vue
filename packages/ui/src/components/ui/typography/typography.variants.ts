import { cva } from 'class-variance-authority';

export const typographyVariants = cva('text-neutral-700', {
  variants: {
    variant: {
      'heading-1': 'text-nt-h1 font-medium leading-nl-tight',
      'heading-2': 'text-nt-h2 font-medium leading-nl-tight',
      'subtitle-md': 'text-nt-base font-medium leading-nl-tight',
      'subtitle-sm': 'text-nt-sm font-medium leading-nl-tight',
      'body-lg': 'text-nt-base font-normal leading-nl-normal',
      'body-lg-medium': 'text-nt-base font-medium leading-nl-normal',
      'body-md': 'text-nt-sm font-normal leading-nl-normal',
      'body-md-medium': 'text-nt-sm font-medium leading-nl-normal',
      'body-sm': 'text-nt-tiny font-normal leading-nl-normal',
      'body-sm-medium': 'text-nt-tiny font-medium leading-nl-normal',
      'body-xs': 'text-nt-micro font-normal leading-nl-normal',
      'body-xs-medium': 'text-nt-micro font-medium leading-nl-normal',
    },
  },
  defaultVariants: {
    variant: 'body-md',
  },
});
