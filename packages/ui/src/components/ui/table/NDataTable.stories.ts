import type { Meta, StoryObj } from '@storybook/vue3';
import { h, ref } from 'vue';
import { NDataTable } from './index';
import { NCheckbox } from '../checkbox';
import { Icon } from '@iconify/vue';
import { createColumnHelper } from '@tanstack/vue-table';

interface Book {
  id: string;
  name: string;
  writer: string;
  subject: string;
  class: string;
  publish_date: string;
  image: string;
}

const columnHelper = createColumnHelper<Book>();

const meta: Meta<typeof NDataTable> = {
  title: 'Components/UI/NDataTable',
  component: NDataTable as any,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NDataTable>;

const data: Book[] = [
  {
    id: '#0011',
    name: 'Literature',
    writer: 'Wade Warren',
    subject: 'English',
    class: '02',
    publish_date: '22 Octo, 2022',
    image: 'https://ui-avatars.com/api/?name=L&background=random',
  },
  {
    id: '#0021',
    name: 'Mathematics',
    writer: 'David Morgan',
    subject: 'Mathematics',
    class: '01',
    publish_date: '12 Sep, 2023',
    image: 'https://ui-avatars.com/api/?name=M&background=random',
  },
  {
    id: '#0031',
    name: 'English',
    writer: 'Kristin Watson',
    subject: 'Physics',
    class: '03',
    publish_date: '23 Nov, 2020',
    image: 'https://ui-avatars.com/api/?name=E&background=random',
  },
  {
    id: '#0013',
    name: 'Mathematics',
    writer: 'Savannah Nguyen',
    subject: 'Mathematics',
    class: '04',
    publish_date: '12 Octo, 2022',
    image: 'https://ui-avatars.com/api/?name=N&background=random',
  },
  {
    id: '#0018',
    name: 'English',
    writer: 'Jacob Jones',
    subject: 'Physics',
    class: '01',
    publish_date: '22 Octo, 2022',
    image: 'https://ui-avatars.com/api/?name=J&background=random',
  },
];

export const Default: Story = {
  render: (args: any) => ({
    components: { NDataTable, NCheckbox, Icon },
    setup() {
      const columns = [
        columnHelper.display({
          id: 'select',
          header: ({ table }) =>
            h(NCheckbox, {
              modelValue: table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? 'indeterminate'
                  : false,
              'onUpdate:modelValue': (v: any) =>
                table.toggleAllPageRowsSelected(!!v),
            }),
          cell: ({ row }) =>
            h(NCheckbox, {
              modelValue: row.getIsSelected(),
              'onUpdate:modelValue': (v: any) => row.toggleSelected(!!v),
            }),
        }),
        columnHelper.accessor('name', { header: 'Book Name' }),
        columnHelper.accessor('writer', { header: 'Writer' }),
        columnHelper.accessor('id', { header: 'Id' }),
        columnHelper.accessor('subject', { header: 'Subject' }),
        columnHelper.accessor('class', { header: 'Class' }),
        columnHelper.accessor('publish_date', { header: 'Publish Date' }),
        columnHelper.display({
          id: 'action',
          header: 'Action',
          cell: () =>
            h('div', { class: 'flex gap-2 items-center' }, [
              h(Icon, {
                icon: 'lucide:trash',
                class: 'h-4 w-4 text-gray-400 hover:text-danger cursor-pointer transition-colors',
              }),
              h(Icon, {
                icon: 'lucide:edit',
                class: 'h-4 w-4 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors',
              }),
            ]),
        }),
      ];
      return { args, columns, data };
    },
    template: `
      <div class="p-8 bg-gray-50 min-h-screen font-inter">
        <NDataTable v-bind="args" :columns="columns" :data="data">
          <!-- Custom Cell for Book Name with Avatar -->
          <template #cell-name="{ row, value }">
            <div class="flex items-center gap-3">
               <img :src="row.original.image" class="h-9 w-9 rounded-full object-cover shadow-sm border border-white shrink-0" />
               <span class="font-semibold text-gray-900 truncate">{{ value }}</span>
            </div>
          </template>
        </NDataTable>
      </div>
    `,
  }),
};

export const CollapsibleRows: Story = {
  render: (args: any) => ({
    components: { NDataTable, NCheckbox, Icon },
    setup() {
      const columns = [
        columnHelper.display({
          id: 'expander',
          header: () => null,
          cell: ({ row }) =>
            h(
              'button',
              {
                class: 'flex h-8 w-8 items-center justify-center hover:bg-gray-100 rounded-lg transition-all',
                onClick: (e: MouseEvent) => {
                   e.stopPropagation();
                   row.toggleExpanded();
                },
              },
              [
                h(Icon, {
                  icon: row.getIsExpanded()
                    ? 'lucide:chevron-down'
                    : 'lucide:chevron-right',
                  class: 'h-4 w-4 text-gray-400 transition-transform duration-200',
                }),
              ],
            ),
        }),
        columnHelper.accessor('name', { header: 'Module Name' }),
        columnHelper.accessor('subject', { header: 'Category' }),
        columnHelper.accessor('id', { header: 'Code' }),
      ];

      const simpleData = data.slice(0, 3);
      return { args, columns, data: simpleData };
    },
    template: `
      <div class="p-8 bg-gray-50 min-h-screen">
        <NDataTable v-bind="args" :columns="columns" :data="data" collapsible>
          <template #expanded-row="{ row }">
            <div class="p-6 bg-white rounded-2xl border border-gray-100 flex flex-col gap-3 shadow-inner">
               <h5 class="text-sm font-bold text-gray-900">Module Details: {{ row.original.name }}</h5>
               <p class="text-xs text-gray-500 leading-relaxed max-w-lg">
                 This is a collapsible detail panel. You can render any sub-component here, 
                 including nested tables, charts, or detailed forms for SIMRS medical records.
               </p>
               <div class="flex gap-4">
                  <div class="px-3 py-1 bg-brand/10 text-brand text-[10px] font-bold rounded-full uppercase tracking-wider">Active Status</div>
                  <div class="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-wider">Version 1.0.4</div>
               </div>
            </div>
          </template>
        </NDataTable>
      </div>
    `,
  }),
};

export const PaginationDemo: Story = {
  args: {
    pageSize: 5,
  },
  render: (args: any) => ({
    components: { NDataTable },
    setup() {
      const columns = [
        columnHelper.accessor('id', { header: 'ID' }),
        columnHelper.accessor('name', { header: 'Item Name' }),
        columnHelper.accessor('writer', { header: 'Owner' }),
      ];

      // Generate 50 items to trigger ellipsis
      const largeData = Array.from({ length: 50 }, (_, i) => ({
        id: `#${(i + 1).toString().padStart(4, '0')}`,
        name: `Database Record ${i + 1}`,
        writer: 'System Admin',
        subject: 'Log',
        class: 'A1',
        publish_date: '2024-04-14',
        image: '',
      }));

      return { args, columns, data: largeData };
    },
    template: `
      <div class="p-8 bg-gray-50 min-h-screen">
         <div class="mb-4">
            <h3 class="text-lg font-bold text-gray-900">Large Dataset Pagination</h3>
            <p class="text-sm text-gray-500">Testing long list handling and ellipsis logic (pageSize: 5)</p>
         </div>
        <NDataTable v-bind="args" :columns="columns" :data="data" />
      </div>
    `,
  }),
};
