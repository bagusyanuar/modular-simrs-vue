import type { Meta, StoryObj } from '@storybook/vue3';
import NBadge from './NBadge.vue';

const meta: Meta<typeof NBadge> = {
  title: 'Components/UI/NBadge',
  component: NBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NBadge>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => ({
    components: { NBadge },
    setup() {
      return { args };
    },
    template: '<NBadge v-bind="args">Badge</NBadge>',
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  render: (args) => ({
    components: { NBadge },
    setup() {
      return { args };
    },
    template: '<NBadge v-bind="args">Secondary Badge</NBadge>',
  }),
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
  render: (args) => ({
    components: { NBadge },
    setup() {
      return { args };
    },
    template: '<NBadge v-bind="args">Destructive Badge</NBadge>',
  }),
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
  render: (args) => ({
    components: { NBadge },
    setup() {
      return { args };
    },
    template: '<NBadge v-bind="args">Outline Badge</NBadge>',
  }),
};
