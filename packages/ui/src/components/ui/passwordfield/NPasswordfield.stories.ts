import type { Meta, StoryObj } from '@storybook/vue3';
import NPasswordfield from './NPasswordfield.vue';
import { Icon } from '@iconify/vue';

const meta: Meta<typeof NPasswordfield> = {
  title: 'Components/UI/NPasswordfield',
  component: NPasswordfield,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: { type: 'boolean' } },
    error: { control: { type: 'boolean' } },
  },
} satisfies Meta<typeof NPasswordfield>;

export default meta;
type Story = StoryObj<typeof NPasswordfield>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your password...',
  },
};

export const CustomPrefix: Story = {
  args: {
    placeholder: 'Password with custom icon',
  },
  render: (args) => ({
    components: { NPasswordfield, Icon },
    setup() {
      return { args };
    },
    template: `
      <NPasswordfield v-bind="args">
        <template #prefix>
          <Icon icon="ph:key-bold" />
        </template>
      </NPasswordfield>
    `,
  }),
};

export const Error: Story = {
  args: {
    placeholder: 'Invalid password',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled field',
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => ({
    components: { NPasswordfield },
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <NPasswordfield size="sm" placeholder="Small size" />
        <NPasswordfield size="md" placeholder="Medium size" />
        <NPasswordfield size="lg" placeholder="Large size" />
      </div>
    `,
  }),
};
