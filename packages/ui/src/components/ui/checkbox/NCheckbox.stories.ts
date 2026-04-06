import type { Meta, StoryObj } from '@storybook/vue3';
import NCheckbox from './NCheckbox.vue';

const meta: Meta<typeof NCheckbox> = {
  title: 'Components/UI/NCheckbox',
  component: NCheckbox,
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
type Story = StoryObj<typeof NCheckbox>;

export const Default: Story = {
  args: {
    modelValue: false,
  },
  render: (args) => ({
    components: { NCheckbox },
    setup() {
      return { args };
    },
    template: `
      <div class="flex items-center space-x-2">
        <NCheckbox id="terms" v-model="args.modelValue" v-bind="args" />
        <label
          for="terms"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
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
    components: { NCheckbox },
    setup() {
      return { args };
    },
    template: `
      <div class="flex items-center space-x-2">
        <NCheckbox id="terms2" v-model="args.modelValue" v-bind="args" />
        <label
          for="terms2"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
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
    components: { NCheckbox },
    setup() {
      return { args };
    },
    template: `
      <div class="flex items-center space-x-2">
        <NCheckbox id="terms3" v-model="args.modelValue" v-bind="args" />
        <label
          for="terms3"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
      </div>
    `,
  }),
};
