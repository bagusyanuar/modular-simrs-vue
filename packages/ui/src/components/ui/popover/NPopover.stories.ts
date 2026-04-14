import type { Meta, StoryObj } from '@storybook/vue3';
import { NPopover, NPopoverTrigger, NPopoverContent } from './index';
import { NButton } from '../button';
import { Icon } from '@iconify/vue';

const meta: Meta<typeof NPopover> = {
  title: 'Components/UI/NPopover',
  component: NPopover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NPopover>;

export const Default: Story = {
  render: (args: any) => ({
    components: { NPopover, NPopoverTrigger, NPopoverContent, NButton },
    setup() {
      return { args };
    },
    template: `
      <div class="flex h-[400px] items-center justify-center">
        <NPopover v-bind="args">
          <NPopoverTrigger as-child>
            <NButton variant="outline">Open Popover</NButton>
          </NPopoverTrigger>
          <NPopoverContent class="w-80">
            <div class="grid gap-4">
              <div class="space-y-2">
                <h4 class="font-medium leading-none">Dimensions</h4>
                <p class="text-sm text-gray-500">
                  Set the dimensions for the layer.
                </p>
              </div>
              <div class="grid gap-2">
                <div class="grid grid-cols-3 items-center gap-4">
                  <label for="width" class="text-xs font-medium">Width</label>
                  <input id="width" value="100%" class="col-span-2 h-8 rounded border border-gray-100 px-2 text-xs outline-none focus:border-brand" />
                </div>
                <div class="grid grid-cols-3 items-center gap-4">
                  <label for="maxWidth" class="text-xs font-medium">Max. width</label>
                  <input id="maxWidth" value="300px" class="col-span-2 h-8 rounded border border-gray-100 px-2 text-xs outline-none focus:border-brand" />
                </div>
              </div>
            </div>
          </NPopoverContent>
        </NPopover>
      </div>
    `,
  }),
};

export const WithArrow: Story = {
  args: {
    // Show arrow is on the Content, but we can pass it via render for demo
  },
  render: (args: any) => ({
    components: { NPopover, NPopoverTrigger, NPopoverContent, NButton, Icon },
    setup() {
      return { args };
    },
    template: `
      <div class="flex h-[400px] items-center justify-center">
        <NPopover v-bind="args">
          <NPopoverTrigger as-child>
            <NButton>Popover with Arrow</NButton>
          </NPopoverTrigger>
          <NPopoverContent :show-arrow="true" side="top">
            <div class="flex flex-col gap-2">
               <div class="flex items-center gap-2 text-brand">
                 <Icon icon="lucide:info" />
                 <span class="font-bold text-sm">Rich Content</span>
               </div>
               <p class="text-xs text-gray-500 leading-relaxed">
                 You can put anything inside the popover. It will automatically adjust position to stay visible.
               </p>
               <NButton size="sm" class="mt-2">Action</NButton>
            </div>
          </NPopoverContent>
        </NPopover>
      </div>
    `,
  }),
};
