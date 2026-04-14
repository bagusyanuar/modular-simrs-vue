import type { Meta, StoryObj } from '@storybook/vue3';
import NTextfield from './NTextfield.vue';
import { Icon } from '@iconify/vue';

const meta: Meta<typeof NTextfield> = {
  title: 'Components/UI/NTextfield',
  component: NTextfield,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: { type: 'boolean' } },
    error: { control: { type: 'boolean' } },
  },
};

export default meta;
type Story = StoryObj<typeof NTextfield>;

export const Default: Story = {
  args: {
    placeholder: 'Type something...',
  },
};

export const WithPrefix: Story = {
  args: {
    placeholder: 'Search documentation...',
  },
  parameters: {
    docs: {
      source: {
        code: `
<NTextfield placeholder="Search documentation...">
  <template #prefix>
    <Icon icon="lucide:search" />
  </template>
</NTextfield>
        `,
      },
    },
  },
  render: (args) => ({
    components: { NTextfield, Icon },
    setup() {
      return { args };
    },
    template: `
      <NTextfield v-bind="args">
        <template #prefix>
          <Icon icon="lucide:search" />
        </template>
      </NTextfield>
    `,
  }),
};

export const WithSuffix: Story = {
  args: {
    placeholder: 'Enter your email',
    type: 'email',
  },
  parameters: {
    docs: {
      source: {
        code: `
<NTextfield placeholder="Enter your email" type="email">
  <template #suffix>
    <Icon icon="lucide:mail" />
  </template>
</NTextfield>
        `,
      },
    },
  },
  render: (args) => ({
    components: { NTextfield, Icon },
    setup() {
      return { args };
    },
    template: `
      <NTextfield v-bind="args">
        <template #suffix>
          <Icon icon="lucide:mail" />
        </template>
      </NTextfield>
    `,
  }),
};

export const Error: Story = {
  args: {
    placeholder: 'Invalid input',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => ({
    components: { NTextfield, Icon },
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <NTextfield size="sm" placeholder="Small size">
          <template #prefix>
            <Icon icon="lucide:search" />
          </template>
        </NTextfield>
        <NTextfield size="md" placeholder="Medium size">
          <template #prefix>
            <Icon icon="lucide:search" />
          </template>
        </NTextfield>
        <NTextfield size="lg" placeholder="Large size">
          <template #prefix>
            <Icon icon="lucide:search" />
          </template>
        </NTextfield>
      </div>
    `,
  }),
};
