import type { Meta, StoryObj } from '@storybook/vue3';
import { NSelect } from './';
import { ref } from 'vue';

/**
 * A Combobox component that combines a button trigger, a popover, and a command menu.
 * Based on the NSelect component implementation.
 */
const meta: Meta<typeof NSelect> = {
  title: 'Components/UI/NSelect',
  component: NSelect,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    options: { control: 'object' },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    emptyMessage: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof NSelect>;

const frameworks = [
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt.js', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

export const Default: Story = {
  args: {
    options: frameworks,
    placeholder: 'Select framework...',
    searchPlaceholder: 'Search framework...',
  },
  render: (args) => ({
    components: { NSelect },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: `
      <div class="flex flex-col gap-4 p-8">
        <NSelect class="w-[300px]" v-bind="args" v-model="value" />
        <p class="text-sm">
          Selected Value: <code class="bg-muted px-1 rounded">{{ value || 'none' }}</code>
        </p>
      </div>
    `,
  }),
};
