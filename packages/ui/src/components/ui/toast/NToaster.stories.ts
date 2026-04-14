import type { Meta, StoryObj } from '@storybook/vue3';
import { NToaster, toast } from './index';
import { NButton } from '../button';

const meta: Meta<typeof NToaster> = {
  title: 'Components/UI/NToaster',
  component: NToaster,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NToaster>;

export const Default: Story = {
  render: (args: any) => ({
    components: { NToaster, NButton },
    setup() {
      const showToast = () => {
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
          },
        });
      };
      return { args, showToast };
    },
    template: `
      <div>
        <NButton @click="showToast">Show Toast</NButton>
        <NToaster v-bind="args" />
      </div>
    `,
  }),
};

export const Success: Story = {
  render: (args: any) => ({
    components: { NToaster, NButton },
    setup() {
      const showToast = () => {
        toast.success('Successfully saved!', {
          description: 'Your changes have been saved to the server.',
        });
      };
      return { args, showToast };
    },
    template: `
      <div>
        <NButton @click="showToast">Show Success Toast</NButton>
        <NToaster v-bind="args" />
      </div>
    `,
  }),
};

export const Error: Story = {
  render: (args: any) => ({
    components: { NToaster, NButton },
    setup() {
      const showToast = () => {
        toast.error('Something went wrong', {
          description: 'Please try again later or contact support.',
        });
      };
      return { args, showToast };
    },
    template: `
      <div>
        <NButton @click="showToast">Show Error Toast</NButton>
        <NToaster v-bind="args" />
      </div>
    `,
  }),
};

export const Warning: Story = {
  render: (args: any) => ({
    components: { NToaster, NButton },
    setup() {
      const showToast = () => {
        toast.warning('Warning detected', {
          description: 'Your account balance is low. Please top up.',
        });
      };
      return { args, showToast };
    },
    template: `
      <div>
        <NButton @click="showToast">Show Warning Toast</NButton>
        <NToaster v-bind="args" />
      </div>
    `,
  }),
};

export const Info: Story = {
  render: (args: any) => ({
    components: { NToaster, NButton },
    setup() {
      const showToast = () => {
        toast.info('Information', {
          description: 'A new software update is available for your device.',
        });
      };
      return { args, showToast };
    },
    template: `
      <div>
        <NButton @click="showToast">Show Info Toast</NButton>
        <NToaster v-bind="args" />
      </div>
    `,
  }),
};
