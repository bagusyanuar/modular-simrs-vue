import type { Meta, StoryObj } from '@storybook/vue3';
import { NButtonGroup } from './index';
import { NButton } from '../button';

const meta: Meta<typeof NButtonGroup> = {
  title: 'UI/ButtonGroup',
  component: NButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NButtonGroup>;

export const Default: Story = {
  render: (args) => ({
    components: { NButtonGroup, NButton },
    setup() {
      return { args };
    },
    template: `
      <NButtonGroup v-bind="args">
        <NButton variant="outline">Left</NButton>
        <NButton variant="outline">Center</NButton>
        <NButton variant="outline">Right</NButton>
      </NButtonGroup>
    `,
  }),
  args: {
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  render: (args) => ({
    components: { NButtonGroup, NButton },
    setup() {
      return { args };
    },
    template: `
      <NButtonGroup v-bind="args">
        <NButton variant="outline">Top</NButton>
        <NButton variant="outline">Middle</NButton>
        <NButton variant="outline">Bottom</NButton>
      </NButtonGroup>
    `,
  }),
  args: {
    orientation: 'vertical',
  },
};

export const MixedVariants: Story = {
  render: (args) => ({
    components: { NButtonGroup, NButton },
    setup() {
      return { args };
    },
    template: `
      <NButtonGroup v-bind="args">
        <NButton variant="primary">Save</NButton>
        <NButton variant="outline">Cancel</NButton>
      </NButtonGroup>
    `,
  }),
};
