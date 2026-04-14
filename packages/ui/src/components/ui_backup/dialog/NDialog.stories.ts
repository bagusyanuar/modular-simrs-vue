import type { Meta, StoryObj } from '@storybook/vue3';
import {
  NDialog,
  NDialogClose,
  NDialogContent,
  NDialogDescription,
  NDialogFooter,
  NDialogHeader,
  NDialogTitle,
  NDialogTrigger,
} from './';
import { NButton } from '../button';
import { NInput } from '../input';

/**
 * Dialogs are used to display content in a layer above the app, requiring user interaction to dismiss.
 */
const meta: Meta<typeof NDialog> = {
  title: 'Components/UI/NDialog',
  component: NDialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NDialog>;

export const Default: Story = {
  render: (args) => ({
    components: {
      NDialog,
      NDialogClose,
      NDialogContent,
      NDialogDescription,
      NDialogFooter,
      NDialogHeader,
      NDialogTitle,
      NDialogTrigger,
      NButton,
      NInput,
    },
    setup() {
      return { args };
    },
    template: `
      <NDialog v-bind="args">
        <NDialogTrigger as-child>
          <NButton variant="outline">
            Edit Profile
          </NButton>
        </NDialogTrigger>
        <NDialogContent class="sm:max-w-[425px]">
          <NDialogHeader>
            <NDialogTitle>Edit profile</NDialogTitle>
            <NDialogDescription>
              Make changes to your profile here. Click save when you're done.
            </NDialogDescription>
          </NDialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <label for="name" class="text-right text-sm font-medium">
                Name
              </label>
              <NInput id="name" default-value="Pedro Duarte" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <label for="username" class="text-right text-sm font-medium">
                Username
              </label>
              <NInput id="username" default-value="@peduarte" class="col-span-3" />
            </div>
          </div>
          <NDialogFooter>
            <NButton type="submit">
              Save changes
            </NButton>
          </NDialogFooter>
        </NDialogContent>
      </NDialog>
    `,
  }),
};

export const CustomClose: Story = {
  render: (args) => ({
    components: {
      NDialog,
      NDialogClose,
      NDialogContent,
      NDialogDescription,
      NDialogFooter,
      NDialogHeader,
      NDialogTitle,
      NDialogTrigger,
      NButton,
    },
    setup() {
      return { args };
    },
    template: `
      <NDialog v-bind="args">
        <NDialogTrigger as-child>
          <NButton variant="outline">
            Open Scroll Content
          </NButton>
        </NDialogTrigger>
        <NDialogContent class="sm:max-w-md">
          <NDialogHeader>
            <NDialogTitle>Share link</NDialogTitle>
            <NDialogDescription>
              Anyone who has this link will be able to view this.
            </NDialogDescription>
          </NDialogHeader>
          <div class="flex items-center space-x-2 py-4">
            <div class="grid flex-1 gap-2">
              <span>Halo</span>
            </div>
          </div>
          <NDialogFooter class="sm:justify-start">
            <NDialogClose as-child>
              <NButton type="button" variant="secondary">
                Close
              </NButton>
            </NDialogClose>
          </NDialogFooter>
        </NDialogContent>
      </NDialog>
    `,
  }),
};
