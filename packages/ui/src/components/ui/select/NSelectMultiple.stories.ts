import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch } from 'vue';
import NSelectMultiple from './NSelectMultiple.vue';

const meta: Meta<typeof NSelectMultiple> = {
  title: 'Components/UI/NSelectMultiple',
  component: NSelectMultiple,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="padding-bottom: 300px;"><story /></div>',
    }),
  ],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: { type: 'boolean' } },
    error: { control: { type: 'boolean' } },
    loading: { control: { type: 'boolean' } },
    remote: { control: { type: 'boolean' } },
    showIndicator: { control: { type: 'boolean' } },
    clearable: { control: { type: 'boolean' } },
  },
};

export default meta;
type Story = StoryObj<typeof NSelectMultiple>;

const staticOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Grape', value: 'grape' },
  { label: 'Lemon', value: 'lemon' },
  { label: 'Mango', value: 'mango' },
  { label: 'Orange', value: 'orange' },
];

export const Default: Story = {
  args: {
    placeholder: 'Select fruits...',
    options: staticOptions,
    modelValue: ['apple', 'banana'],
  },
};

export const RemoteSearch: Story = {
  args: {
    placeholder: 'Search remotely...',
    remote: true,
    clearable: true,
  },
  render: (args) => ({
    components: { NSelectMultiple },
    setup() {
      const searchTerm = ref('');
      const options = ref([...staticOptions].slice(0, 4));
      const loading = ref(false);
      const model = ref(['apple']);

      watch(searchTerm, (val) => {
        loading.value = true;
        setTimeout(() => {
          if (!val) {
            options.value = [...staticOptions].slice(0, 4);
          } else {
            options.value = staticOptions.filter(opt => 
              opt.label.toLowerCase().includes(val.toLowerCase())
            );
          }
          loading.value = false;
        }, 800);
      });

      return { args, searchTerm, options, loading, model };
    },
    template: `
      <NSelectMultiple 
        v-bind="args" 
        v-model="model"
        v-model:searchTerm="searchTerm" 
        :options="options" 
        :loading="loading"
      />
    `,
  }),
};

export const Clearable: Story = {
  args: {
    placeholder: 'Select items then clear all...',
    options: staticOptions,
    clearable: true,
    modelValue: ['apple', 'banana', 'cherry'],
  },
};

export const Sizes: Story = {
  render: () => ({
    components: { NSelectMultiple },
    setup() {
      const options = staticOptions;
      return { options };
    },
    template: `
      <div class="flex flex-col gap-6 max-w-md">
        <NSelectMultiple size="sm" :options="options" placeholder="Small size" :modelValue="['apple']" />
        <NSelectMultiple size="md" :options="options" placeholder="Medium size" :modelValue="['apple']" />
        <NSelectMultiple size="lg" :options="options" placeholder="Large size" :modelValue="['apple']" />
      </div>
    `,
  }),
};
