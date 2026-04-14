import { cva } from 'class-variance-authority';

export const tableVariants = cva('w-full caption-bottom text-sm border-collapse');

export const tableHeaderVariants = cva(
  'h-12 px-4 text-left align-middle font-semibold text-gray-400 uppercase tracking-wider text-[0.7rem] bg-gray-50/50 [&:has([role=checkbox])]:pr-0'
);

export const tableRowVariants = cva(
  'transition-colors border-b border-gray-50 last:border-0 hover:bg-gray-50/50 data-[state=selected]:bg-brand/[0.03] data-[state=selected]:hover:bg-brand/[0.05]'
);

export const tableCellVariants = cva(
  'p-4 align-middle text-gray-600 [&:has([role=checkbox])]:pr-0'
);

export const tableCaptionVariants = cva('mt-4 text-sm text-gray-400');
