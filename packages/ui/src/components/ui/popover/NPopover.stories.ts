import type { Meta, StoryObj } from '@storybook/vue3';
import {
  NPopover,
  NPopoverTrigger,
  NPopoverContent,
} from './';
import { NButton } from '../button';
import { NInput } from '../input';

/**
 * Popovers are used to display content in a floating layer, relative to an anchor element.
 */
const meta: Meta<typeof NPopover> = {
  title: 'Components/UI/NPopover',
  component: NPopover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NPopover>;

export const Default: Story = {
  args: {
    // No specific args for NPopover root itself usually
  },
  render: (args) => ({
    components: { NPopover, NPopoverTrigger, NPopoverContent, NButton, NInput },
    setup() {
      return { args };
    },
    template: `
      <NPopover v-bind="args">
        <NPopoverTrigger as-child>
          <NButton variant="outline">
            Open Popover
          </NButton>
        </NPopoverTrigger>
        <NPopoverContent class="w-80">
          <div class="grid gap-4">
            <div class="space-y-2">
              <h4 class="font-medium leading-none">Dimensions</h4>
              <p class="text-xs text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div class="grid gap-2">
              <div class="grid grid-cols-3 items-center gap-4">
                <label for="width" class="text-xs font-medium leading-none">Width</label>
                <NInput id="width" default-value="100%" class="col-span-2 h-8 text-xs" />
              </div>
              <div class="grid grid-cols-3 items-center gap-4">
                <label for="maxWidth" class="text-xs font-medium leading-none">Max. width</label>
                <NInput id="maxWidth" default-value="300px" class="col-span-2 h-8 text-xs" />
              </div>
              <div class="grid grid-cols-3 items-center gap-4">
                <label for="height" class="text-xs font-medium leading-none">Height</label>
                <NInput id="height" default-value="25px" class="col-span-2 h-8 text-xs" />
              </div>
              <div class="grid grid-cols-3 items-center gap-4">
                <label for="maxHeight" class="text-xs font-medium leading-none">Max. height</label>
                <NInput id="maxHeight" default-value="none" class="col-span-2 h-8 text-xs" />
              </div>
            </div>
          </div>
        </NPopoverContent>
      </NPopover>
    `,
  }),
};
