import { cva } from 'class-variance-authority';

export const calendarVariants = cva(
  'p-4 bg-background rounded-lg border border-border shadow-xl shadow-gray-200/50 w-fit',
);

export const calendarCellVariants = cva(
  'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:bg-brand/10 [&:has([data-selected])]:rounded-full',
);

export const calendarCellTriggerVariants = cva(
  'h-9 w-9 p-0 font-medium aria-selected:opacity-100 flex items-center justify-center rounded-full transition-all cursor-pointer hover:bg-gray-100 data-[selected]:bg-brand data-[selected]:text-white data-[selected]:hover:bg-brand data-[selected]:hover:text-white data-[disabled]:text-gray-200 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[today]:bg-gray-50 data-[today]:text-brand data-[today]:font-bold data-[outside-view]:text-gray-300 data-[outside-view]:opacity-50 data-[highlighted]:bg-brand/10 data-[highlighted]:rounded-none data-[selection-start]:bg-brand data-[selection-start]:text-white data-[selection-start]:rounded-l-full data-[selection-end]:bg-brand data-[selection-end]:text-white data-[selection-end]:rounded-r-full',
);

export const calendarGridVariants = cva('w-full border-collapse');

export const calendarHeadCellVariants = cva(
  'text-gray-400 rounded-md w-9 font-medium text-[0.75rem] py-2',
);

export const calendarNavButtonVariants = cva(
  'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all shadow-none border-none cursor-pointer',
);
