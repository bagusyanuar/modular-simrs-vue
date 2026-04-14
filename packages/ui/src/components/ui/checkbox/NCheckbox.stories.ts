import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import NCheckbox from './NCheckbox.vue';

const meta: Meta<typeof NCheckbox> = {
  title: 'Components/UI/NCheckbox',
  component: NCheckbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: { type: 'boolean' } },
    error: { control: { type: 'boolean' } },
  },
};

export default meta;
type Story = StoryObj<typeof NCheckbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const States: Story = {
  render: () => ({
    components: { NCheckbox },
    setup() {
      const checked = ref(true);
      const indeterminate = ref('indeterminate');
      const unchecked = ref(false);
      return { checked, indeterminate, unchecked };
    },
    template: `
      <div class="flex flex-col gap-4">
        <NCheckbox v-model="unchecked" label="Unchecked" />
        <NCheckbox v-model="checked" label="Checked" />
        <NCheckbox v-model="indeterminate" label="Indeterminate" />
        <NCheckbox disabled label="Disabled" />
        <NCheckbox error label="Error state" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { NCheckbox },
    template: `
      <div class="flex flex-col gap-4">
        <NCheckbox size="sm" label="Small checkbox" />
        <NCheckbox size="md" label="Medium checkbox" />
        <NCheckbox size="lg" label="Large checkbox" />
      </div>
    `,
  }),
};

export const CustomLabel: Story = {
  render: () => ({
    components: { NCheckbox },
    template: `
      <NCheckbox>
        <span class="text-brand font-bold underline">Custom Styled Label</span>
      </NCheckbox>
    `,
  }),
};
