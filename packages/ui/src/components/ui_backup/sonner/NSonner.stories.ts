import type { Meta, StoryObj } from '@storybook/vue3';
import NSonner from './NSonner.vue';
import { toast } from 'vue-sonner';
import { NButton } from '#components/ui/button';

/**
 * An opinionated toast component for Vue.
 * Based on vue-sonner.
 */
const meta: Meta<typeof NSonner> = {
  title: 'Components/UI/NSonner',
  component: NSonner,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
    },
    expand: { control: 'boolean' },
    richColors: { control: 'boolean' },
    closeButton: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof NSonner>;

export const Default: Story = {
  args: {
    richColors: true,
    closeButton: true,
    position: 'bottom-right',
  },
  render: (args) => ({
    components: { NSonner, NButton },
    setup() {
      const showToast = () => {
        toast('Message Sent', {
          description: 'Your message has been sent successfully.',
        });
      };

      const showSuccess = () => {
        toast.success('Changes Saved', {
          description: 'Your profile has been updated.',
        });
      };

      const showInfo = () => {
        toast.info('New Update Available', {
          description: 'Version 2.0 is now available for download.',
        });
      };

      const showWarning = () => {
        toast.warning('Storage Almost Full', {
          description: 'You have used 90% of your storage space.',
        });
      };

      const showError = () => {
        toast.error('Connection Failed', {
          description: 'Could not connect to the server.',
        });
      };

      const showAction = () => {
        toast('Notification', {
          description: 'A new event has been created.',
          action: {
            label: 'View',
            onClick: () => console.log('Action clicked'),
          },
        });
      };

      return {
        args,
        showToast,
        showSuccess,
        showInfo,
        showWarning,
        showError,
        showAction,
      };
    },
    template: `
      <div class="p-8 space-y-8 bg-muted/20 min-h-[400px] rounded-lg border border-dashed flex flex-col items-center justify-center">
        <div class="text-center space-y-2">
          <h3 class="text-lg font-semibold">Toast Demo</h3>
          <p class="text-sm text-muted-foreground">Click the buttons below to trigger different types of toasts.</p>
        </div>
        
        <div class="grid grid-cols-2 gap-3 max-w-sm w-full">
          <NButton variant="outline" @click="showToast">Default</NButton>
          <NButton variant="outline" @click="showSuccess" class="hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20">Success</NButton>
          <NButton variant="outline" @click="showInfo" class="hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/20">Info</NButton>
          <NButton variant="outline" @click="showWarning" class="hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/20">Warning</NButton>
          <NButton variant="outline" @click="showError" class="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20">Error</NButton>
          <NButton variant="outline" @click="showAction">With Action</NButton>
        </div>
        
        <NSonner v-bind="args" />
      </div>
    `,
  }),
};

export const RichColors: Story = {
  args: {
    richColors: true,
    closeButton: true,
  },
  render: (args) => ({
    components: { NSonner, NButton },
    setup() {
      const trigger = () => {
        toast.success('Success with Rich Colors');
        setTimeout(() => toast.error('Error with Rich Colors'), 500);
      };
      return { args, trigger };
    },
    template: `
      <div class="p-8 flex flex-col items-center gap-4">
        <NButton @click="trigger">Trigger Rich Toasts</NButton>
        <NSonner v-bind="args" />
      </div>
    `,
  }),
};
