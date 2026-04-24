import type { Meta, StoryObj } from '@storybook/vue3';
import NAlert from './NAlert.vue';

const meta: Meta<typeof NAlert> = {
  title: 'Components/UI/NAlert',
  component: NAlert,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['info', 'warning', 'success', 'error'],
    },
    class: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NAlert>;

export const Default: Story = {
  args: {
    type: 'info',
    class: '',
  },
  render: (args) => {
    return {
      components: { NAlert },
      setup() {
        return { args };
      },
      template: `
        <NAlert title="Info" v-bind="args" />
      `,
    };
  },
};
