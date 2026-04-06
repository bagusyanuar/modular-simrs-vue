import type { Meta, StoryObj } from '@storybook/vue3';
import NInput from './NInput.vue';

const meta: Meta<typeof NInput> = {
  title: 'Components/UI/NInput',
  component: NInput,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    placeholder: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NInput>;

export const Default: Story = {
  args: {
    placeholder: 'Enter something...',
  },
  render: (args) => ({
    components: { NInput },
    setup() {
      return { args };
    },
    template: '<NInput v-bind="args" />',
  }),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
  render: (args) => ({
    components: { NInput },
    setup() {
      return { args };
    },
    template: '<NInput v-bind="args" />',
  }),
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
  render: (args) => ({
    components: { NInput },
    setup() {
      return { args };
    },
    template: '<NInput v-bind="args" />',
  }),
};
