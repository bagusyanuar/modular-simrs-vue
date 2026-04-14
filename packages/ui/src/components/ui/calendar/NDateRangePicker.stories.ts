import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { NDateRangePicker } from './index';

const meta: Meta<typeof NDateRangePicker> = {
  title: 'Components/UI/NDateRangePicker',
  component: NDateRangePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NDateRangePicker>;

export const Default: Story = {
  render: (args: any) => ({
    components: { NDateRangePicker },
    setup() {
      const range = ref({
        start: undefined,
        end: undefined,
      });
      return { args, range };
    },
    template: `
      <div class="p-20 max-w-md mx-auto h-[600px]">
        <h4 class="text-sm font-semibold mb-3 text-gray-700">Filter Date Range</h4>
        <NDateRangePicker v-bind="args" v-model="range" />
        <div class="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
           <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Internal State</p>
           <pre class="text-xs text-gray-600 font-mono">{{ range }}</pre>
        </div>
      </div>
    `,
  }),
};

export const MultiMonth: Story = {
  args: {
    numberOfMonths: 2,
    placeholder: 'Select range (2 months)',
  },
  render: (args: any) => ({
    components: { NDateRangePicker },
    setup() {
      const range = ref({
        start: undefined,
        end: undefined,
      });
      return { args, range };
    },
    template: `
      <div class="p-20 flex justify-center h-[600px]">
        <div class="w-80">
          <NDateRangePicker v-bind="args" v-model="range" />
        </div>
      </div>
    `,
  }),
};

export const ErrorState: Story = {
  args: {
    error: true,
  },
  render: (args: any) => ({
    components: { NDateRangePicker },
    setup() {
      const range = ref({ start: undefined, end: undefined });
      return { args, range };
    },
    template: `
      <div class="p-20 max-w-md mx-auto h-[600px]">
        <h4 class="text-sm font-semibold mb-3 text-gray-700">Invalid Range</h4>
        <NDateRangePicker v-bind="args" v-model="range" />
        <p class="mt-2 text-xs text-danger font-medium font-inter">The selected date range is invalid or overlaps with an existing schedule.</p>
      </div>
    `,
  }),
};
