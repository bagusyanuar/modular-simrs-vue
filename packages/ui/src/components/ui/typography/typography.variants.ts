import { cva } from 'class-variance-authority';

export const typographyVariants = cva('text-neutral-700', {
  variants: {
    variant: {
      'heading-1': 'neusize-h1 font-medium leading-nl-tight',
      'heading-2': 'neusize-h2 font-medium leading-nl-tight',
      'subtitle-md': 'neusize-base font-medium leading-nl-tight',
      'subtitle-sm': 'neusize-sm font-medium leading-nl-tight',
      'body-lg': 'neusize-base font-normal leading-nl-normal',
      'body-lg-medium': 'neusize-base font-medium leading-nl-normal',
      'body-md': 'neusize-sm font-normal leading-nl-normal',
      'body-md-medium': 'neusize-sm font-medium leading-nl-normal',
      'body-sm': 'neusize-tiny font-normal leading-nl-normal',
      'body-sm-medium': 'neusize-tiny font-medium leading-nl-normal',
      'body-xs': 'neusize-micro font-normal leading-nl-normal',
      'body-xs-medium': 'neusize-micro font-medium leading-nl-normal',
    },
  },
  defaultVariants: {
    variant: 'body-md',
  },
});
