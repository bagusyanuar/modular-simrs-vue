import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { NDatePicker } from './index';

const meta: Meta<typeof NDatePicker> = {
  title: 'Components/UI/NDatePicker',
  component: NDatePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NDatePicker>;

export const Default: Story = {
  render: (args: any) => ({
    components: { NDatePicker },
    setup() {
      const date = ref();
      return { args, date };
    },
    template: `
      <div class="p-20 max-w-sm mx-auto h-[500px]">
        <h4 class="text-sm font-semibold mb-3 text-gray-700">Appointment Date</h4>
        <NDatePicker v-bind="args" v-model="date" />
        <p class="mt-6 text-xs text-gray-400">
          Raw Output: <span class="text-brand font-mono">{{ date || 'None' }}</span>
        </p>
      </div>
    `,
  }),
};

export const Indonesian: Story = {
  args: {
    locale: 'id-ID',
    placeholder: 'Pilih tanggal pendaftaran',
  },
  render: (args: any) => ({
    components: { NDatePicker },
    setup() {
      const date = ref();
      return { args, date };
    },
    template: `
       <div class="p-20 max-w-sm mx-auto h-[500px]">
        <h4 class="text-sm font-semibold mb-3 text-gray-700">Tanggal Pendaftaran</h4>
        <NDatePicker v-bind="args" v-model="date" />
      </div>
    `,
  }),
};

export const ErrorState: Story = {
  args: {
    error: true,
    placeholder: 'Choose date...',
  },
  render: (args: any) => ({
    components: { NDatePicker },
    setup() {
      const date = ref();
      return { args, date };
    },
    template: `
      <div class="p-20 max-w-sm mx-auto h-[500px]">
        <h4 class="text-sm font-semibold mb-3 text-gray-700">Invalid Date</h4>
        <NDatePicker v-bind="args" v-model="date" />
        <p class="mt-2 text-xs text-danger font-medium font-inter">Please select a valid date to proceed.</p>
      </div>
    `,
  }),
};
