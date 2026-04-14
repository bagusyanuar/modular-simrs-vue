import type { Meta, StoryObj } from '@storybook/vue3';
import { NTooltip, NTooltipTrigger, NTooltipContent, NTooltipProvider } from './index';
import { NButton } from '../button';

const meta: Meta<typeof NTooltip> = {
  title: 'Components/UI/NTooltip',
  component: NTooltip,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<NTooltipProvider><story /></NTooltipProvider>',
      components: { NTooltipProvider },
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof NTooltip>;

export const Default: Story = {
  render: (args: any) => ({
    components: { NTooltip, NTooltipTrigger, NTooltipContent, NButton },
    setup() {
      return { args };
    },
    template: `
      <div class="flex h-[200px] items-center justify-center">
        <NTooltip v-bind="args">
          <NTooltipTrigger as-child>
            <NButton variant="outline">Hover Me</NButton>
          </NTooltipTrigger>
          <NTooltipContent>
            <p>Add to library</p>
          </NTooltipContent>
        </NTooltip>
      </div>
    `,
  }),
};

export const WithArrow: Story = {
  render: (args: any) => ({
    components: { NTooltip, NTooltipTrigger, NTooltipContent, NButton },
    setup() {
      return { args };
    },
    template: `
      <div class="flex h-[200px] items-center justify-center">
        <NTooltip v-bind="args">
          <NTooltipTrigger as-child>
            <NButton>Tooltip with Arrow</NButton>
          </NTooltipTrigger>
          <NTooltipContent :show-arrow="true">
            <p>Tooltip with arrow pointing to trigger</p>
          </NTooltipContent>
        </NTooltip>
      </div>
    `,
  }),
};

export const Positions: Story = {
  render: () => ({
    components: { NTooltip, NTooltipTrigger, NTooltipContent, NButton },
    template: `
      <div class="flex h-[300px] items-center justify-center gap-4">
        <NTooltip>
          <NTooltipTrigger as-child><NButton variant="outline">Top</NButton></NTooltipTrigger>
          <NTooltipContent side="top">Top Tooltip</NTooltipContent>
        </NTooltip>
        <NTooltip>
          <NTooltipTrigger as-child><NButton variant="outline">Bottom</NButton></NTooltipTrigger>
          <NTooltipContent side="bottom">Bottom Tooltip</NTooltipContent>
        </NTooltip>
        <NTooltip>
          <NTooltipTrigger as-child><NButton variant="outline">Left</NButton></NTooltipTrigger>
          <NTooltipContent side="left">Left Tooltip</NTooltipContent>
        </NTooltip>
        <NTooltip>
          <NTooltipTrigger as-child><NButton variant="outline">Right</NButton></NTooltipTrigger>
          <NTooltipContent side="right">Right Tooltip</NTooltipContent>
        </NTooltip>
      </div>
    `,
  }),
};
