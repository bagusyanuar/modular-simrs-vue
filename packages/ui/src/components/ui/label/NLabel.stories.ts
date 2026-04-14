import type { Meta, StoryObj } from '@storybook/vue3';
import NLabel from './NLabel.vue';

const meta: Meta<typeof NLabel> = {
  title: 'Components/UI/NLabel',
  component: NLabel,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    required: { control: { type: 'boolean' } },
  },
} satisfies Meta<typeof NLabel>;

export default meta;
type Story = StoryObj<typeof NLabel>;

export const Default: Story = {
  args: {
    size: 'md',
    required: false,
  },
  render: (args) => ({
    components: { NLabel },
    setup() { return { args }; },
    template: '<NLabel v-bind="args">Username</NLabel>',
  }),
};

export const Required: Story = {
  args: {
    required: true,
  },
  render: (args) => ({
    components: { NLabel },
    setup() { return { args }; },
    template: '<NLabel v-bind="args">Email Address</NLabel>',
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { NLabel },
    template: `
      <div class="flex flex-col gap-4">
        <NLabel size="sm" required>Small Label</NLabel>
        <NLabel size="md" required>Medium Label</NLabel>
        <NLabel size="lg" required>Large Label</NLabel>
      </div>
    `,
  }),
};
