import type { Meta, StoryObj } from '@storybook/vue3';
import NButton from './NButton.vue';

const meta: Meta<typeof NButton> = {
  title: 'Components/UI/NButton',
  component: NButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NButton>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
  },
  render: (args) => ({
    components: { NButton },
    setup() {
      return { args };
    },
    template: '<NButton v-bind="args">Button</NButton>',
  }),
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
  render: (args) => ({
    components: { NButton },
    setup() {
      return { args };
    },
    template: '<NButton v-bind="args">Outline Button</NButton>',
  }),
};
