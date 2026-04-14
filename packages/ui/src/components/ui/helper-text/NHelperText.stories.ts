import type { Meta, StoryObj } from '@storybook/vue3';
import NHelperText from './NHelperText.vue';

const meta: Meta<typeof NHelperText> = {
  title: 'Components/UI/NHelperText',
  component: NHelperText,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    error: { control: { type: 'boolean' } },
  },
} satisfies Meta<typeof NHelperText>;

export default meta;
type Story = StoryObj<typeof NHelperText>;

export const Default: Story = {
  args: {
    size: 'md',
    error: false,
  },
  render: (args) => ({
    components: { NHelperText },
    setup() { return { args }; },
    template: '<NHelperText v-bind="args">This is a helper text.</NHelperText>',
  }),
};

export const Error: Story = {
  args: {
    error: true,
  },
  render: (args) => ({
    components: { NHelperText },
    setup() { return { args }; },
    template: '<NHelperText v-bind="args">This is an error message.</NHelperText>',
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { NHelperText },
    template: `
      <div class="flex flex-col gap-2">
        <NHelperText size="sm">Small helper text</NHelperText>
        <NHelperText size="md">Medium helper text</NHelperText>
        <NHelperText size="lg">Large helper text</NHelperText>
      </div>
    `,
  }),
};
