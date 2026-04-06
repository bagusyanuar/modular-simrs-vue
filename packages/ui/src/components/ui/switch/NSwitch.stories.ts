import type { Meta, StoryObj } from '@storybook/vue3';
import NSwitch from './NSwitch.vue';

const meta: Meta<typeof NSwitch> = {
  title: 'Components/UI/NSwitch',
  component: NSwitch,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NSwitch>;

export const Default: Story = {
  args: {
    modelValue: false,
  },
  render: (args) => ({
    components: { NSwitch },
    setup() {
      return { args };
    },
    template: `
      <div class="flex items-center space-x-2">
        <NSwitch id="airplane-mode" v-model="args.modelValue" v-bind="args" />
        <label
          for="airplane-mode"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Airplane Mode
        </label>
      </div>
    `,
  }),
};

export const Checked: Story = {
  args: {
    modelValue: true,
  },
  render: (args) => ({
    components: { NSwitch },
    setup() {
      return { args };
    },
    template: `
      <div class="flex items-center space-x-2">
        <NSwitch id="airplane-mode2" v-model="args.modelValue" v-bind="args" />
        <label
          for="airplane-mode2"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Airplane Mode
        </label>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { NSwitch },
    setup() {
      return { args };
    },
    template: `
      <div class="flex items-center space-x-2">
        <NSwitch id="airplane-mode3" v-model="args.modelValue" v-bind="args" />
        <label
          for="airplane-mode3"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Airplane Mode
        </label>
      </div>
    `,
  }),
};
