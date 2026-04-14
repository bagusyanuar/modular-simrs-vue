import type { Meta, StoryObj } from '@storybook/vue3';
import NButton from './NButton.vue';

const meta: Meta<typeof NButton> = {
  title: 'Components/UI/NButton',
  component: NButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'outline', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'icon'],
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NButton>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
  render: (args) => ({
    components: { NButton },
    setup() {
      return { args };
    },
    template: '<NButton v-bind="args">Primary Button</NButton>',
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

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
  render: (args) => ({
    components: { NButton },
    setup() {
      return { args };
    },
    template: '<NButton v-bind="args">Ghost Button</NButton>',
  }),
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
  },
  render: (args) => ({
    components: { NButton },
    setup() {
      return { args };
    },
    template: '<NButton v-bind="args">Disabled Button</NButton>',
  }),
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
  },
  render: (args) => ({
    components: { NButton },
    setup() {
      return { args };
    },
    template: '<NButton v-bind="args">Processing...</NButton>',
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { NButton },
    template: `
      <div class="flex items-center gap-4">
        <NButton size="sm">Small</NButton>
        <NButton size="md">Medium</NButton>
        <NButton size="lg">Large</NButton>
        <NButton size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </NButton>
      </div>
    `,
  }),
};
