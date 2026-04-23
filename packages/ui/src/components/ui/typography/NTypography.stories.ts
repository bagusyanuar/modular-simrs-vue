import type { Meta, StoryObj } from '@storybook/vue3';
import NTypography from './NTypography.vue';

const meta: Meta<typeof NTypography> = {
  title: 'Components/UI/NTypography',
  component: NTypography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'heading-1',
        'heading-2',
        'subtitle-md',
        'subtitle-sm',
        'body-lg',
        'body-lg-medium',
        'body-md',
        'body-md-medium',
        'body-sm',
        'body-sm-medium',
        'body-xs',
        'body-xs-medium',
      ],
    },
    as: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label', 'small', 'blockquote'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NTypography>;

export const Default: Story = {
  args: {
    variant: 'body-md',
    as: 'p',
    // @ts-ignore - Storybook internal
    default: 'The quick brown fox jumps over the lazy dog',
  },
  render: (args) => ({
    components: { NTypography },
    setup() {
      return { args };
    },
    template: `
      <NTypography v-bind="args">
        {{ args.default }}
      </NTypography>
    `,
  }),
};

export const Headings: Story = {
  render: () => ({
    components: { NTypography },
    template: `
      <div class="flex flex-col gap-4">
        <NTypography variant="heading-1" as="h1">Heading 1 (24px)</NTypography>
        <NTypography variant="heading-2" as="h2">Heading 2 (18px)</NTypography>
      </div>
    `,
  }),
};

export const Subtitles: Story = {
  render: () => ({
    components: { NTypography },
    template: `
      <div class="flex flex-col gap-4">
        <NTypography variant="subtitle-md">Subtitle MD (16px)</NTypography>
        <NTypography variant="subtitle-sm">Subtitle SM (14px)</NTypography>
      </div>
    `,
  }),
};

export const Body: Story = {
  render: () => ({
    components: { NTypography },
    template: `
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <p class="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Large (16px)</p>
          <NTypography variant="body-lg">Body Large Normal</NTypography>
          <NTypography variant="body-lg-medium">Body Large Medium</NTypography>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Medium (14px)</p>
          <NTypography variant="body-md">Body Medium Normal</NTypography>
          <NTypography variant="body-md-medium">Body Medium Medium</NTypography>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Small (12px)</p>
          <NTypography variant="body-sm">Body Small Normal</NTypography>
          <NTypography variant="body-sm-medium">Body Small Medium</NTypography>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Extra Small (10px)</p>
          <NTypography variant="body-xs">Body Extra Small Normal</NTypography>
          <NTypography variant="body-xs-medium">Body Extra Small Medium</NTypography>
        </div>
      </div>
    `,
  }),
};
