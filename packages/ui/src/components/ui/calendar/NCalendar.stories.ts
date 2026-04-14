import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { NCalendar } from './index';
import { today, getLocalTimeZone } from '@internationalized/date';

const meta: Meta<typeof NCalendar> = {
  title: 'Components/UI/NCalendar',
  component: NCalendar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NCalendar>;

export const Default: Story = {
  render: (args: any) => ({
    components: { NCalendar },
    setup() {
      const value = ref(today(getLocalTimeZone()));
      return { args, value };
    },
    template: `
      <div class="flex flex-col items-center p-8 bg-gray-50 h-[500px]">
        <NCalendar v-bind="args" v-model="value" />
        <p class="mt-4 text-sm text-gray-400 font-medium tracking-tight">
          Selected Date: <span class="text-brand">{{ value }}</span>
        </p>
      </div>
    `,
  }),
};

export const MultipleMonths: Story = {
  args: {
    numberOfMonths: 2,
  },
  render: (args: any) => ({
    components: { NCalendar },
    setup() {
      const value = ref(today(getLocalTimeZone()));
      return { args, value };
    },
    template: `
      <div class="flex flex-col items-center p-8 bg-gray-50 h-[500px]">
        <NCalendar v-bind="args" v-model="value" />
      </div>
    `,
  }),
};

export const IndonesianLocale: Story = {
  args: {
    locale: 'id-ID',
  },
  render: (args: any) => ({
    components: { NCalendar },
    setup() {
      const value = ref(today(getLocalTimeZone()));
      return { args, value };
    },
    template: `
      <div class="flex flex-col items-center p-8 bg-gray-50 h-[500px]">
        <h3 class="mb-4 text-sm font-bold text-gray-700">Locale: Indonesia (id-ID)</h3>
        <NCalendar v-bind="args" v-model="value" />
      </div>
    `,
  }),
};
