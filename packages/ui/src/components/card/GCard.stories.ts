import type { Meta, StoryObj } from '@storybook/vue3';
import GCard from './GCard.vue';
import { GButton } from '../button';

const meta: Meta<typeof GCard> = {
  title: 'Components/Card (GCard)',
  component: GCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof GCard>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    description: 'This is the description of the card.',
  },
  render: (args) => ({
    components: { GCard, GButton },
    setup() {
      return { args };
    },
    template: `
      <GCard v-bind="args" class="w-[350px]">
        <p>This is the main content area of the card. You can place anything here.</p>
        <template #footer>
          <GButton text="Cancel" class="bg-gray-200 text-gray-800 hover:bg-gray-300 mr-2" />
          <GButton text="Submit" />
        </template>
      </GCard>
    `,
  }),
};

export const CustomSlots: Story = {
  args: {},
  render: (args) => ({
    components: { GCard },
    setup() {
      return { args };
    },
    template: `
      <GCard class="w-[350px]">
        <template #header>
          <h2 class="text-xl font-bold text-orange-600">Custom Header Slot</h2>
        </template>
        <p>Using slots gives you full control over the header and footer layout without relying solely on props.</p>
        <template #footer>
          <span class="text-sm text-gray-500">Custom Footer Slot Content</span>
        </template>
      </GCard>
    `,
  }),
};
