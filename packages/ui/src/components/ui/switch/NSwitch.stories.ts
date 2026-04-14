import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { NSwitch } from './index';

const meta: Meta<typeof NSwitch> = {
  title: 'Components/UI/NSwitch',
  component: NSwitch,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['brand', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NSwitch>;

export const Default: Story = {
  render: (args: any) => ({
    components: { NSwitch },
    setup() {
      const enabled = ref(false);
      return { args, enabled };
    },
    template: `
      <div class="flex items-center space-x-2">
        <NSwitch v-bind="args" v-model="enabled" id="airplane-mode" />
        <label for="airplane-mode" class="text-sm font-medium leading-none cursor-pointer">
          Airplane Mode: {{ enabled ? 'ON' : 'OFF' }}
        </label>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { NSwitch },
    template: `
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-3">
          <NSwitch size="sm" />
          <span class="text-xs text-gray-400">Small (sm)</span>
        </div>
        <div class="flex items-center gap-3">
          <NSwitch size="md" />
          <span class="text-xs text-gray-400">Medium (md)</span>
        </div>
        <div class="flex items-center gap-3">
          <NSwitch size="lg" />
          <span class="text-xs text-gray-400">Large (lg)</span>
        </div>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args: any) => ({
    components: { NSwitch },
    setup() {
      return { args };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <NSwitch v-bind="args" />
          <span class="text-xs text-gray-400">Disabled Unchecked</span>
        </div>
        <div class="flex items-center gap-3">
          <NSwitch v-bind="args" :default-checked="true" />
          <span class="text-xs text-gray-400">Disabled Checked</span>
        </div>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { NSwitch },
    template: `
      <div class="flex gap-4">
        <NSwitch variant="brand" :default-checked="true" />
        <NSwitch variant="danger" :default-checked="true" />
      </div>
    `,
  }),
};
