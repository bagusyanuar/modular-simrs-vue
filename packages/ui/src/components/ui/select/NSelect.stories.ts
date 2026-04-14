import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch } from 'vue';
import NSelect from './NSelect.vue';

const meta: Meta<typeof NSelect> = {
  title: 'Components/UI/NSelect',
  component: NSelect,
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
  },
};

export default meta;
type Story = StoryObj<typeof NSelect>;

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
    placeholder: 'Select a fruit...',
    options: staticOptions,
  },
};

export const RemoteSearch: Story = {
  args: {
    placeholder: 'Search fruits (remote simulation)...',
    remote: true,
  },
  render: (args) => ({
    components: { NSelect },
    setup() {
      const searchTerm = ref('');
      const options = ref([...staticOptions].slice(0, 3));
      const loading = ref(false);

      watch(searchTerm, (val) => {
        loading.value = true;
        // Simulate API call
        setTimeout(() => {
          if (!val) {
            options.value = [...staticOptions].slice(0, 3);
          } else {
            options.value = staticOptions.filter(opt => 
              opt.label.toLowerCase().includes(val.toLowerCase())
            );
          }
          loading.value = false;
        }, 800);
      });

      return { args, searchTerm, options, loading };
    },
    template: `
      <NSelect 
        v-bind="args" 
        v-model:searchTerm="searchTerm" 
        :options="options" 
        :loading="loading"
      />
    `,
  }),
};

export const InfiniteScroll: Story = {
  args: {
    placeholder: 'Scroll down for more...',
  },
  render: (args) => ({
    components: { NSelect },
    setup() {
      const items = Array.from({ length: 15 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: i + 1,
      }));
      const options = ref(items);
      const loadingMore = ref(false);

      const loadMore = () => {
        if (options.value.length >= 60 || loadingMore.value) return;
        
        loadingMore.value = true;
        setTimeout(() => {
          const nextItems = Array.from({ length: 15 }, (_, i) => ({
            label: `Option ${options.value.length + i + 1}`,
            value: options.value.length + i + 1,
          }));
          options.value.push(...nextItems);
          loadingMore.value = false;
        }, 1000);
      };

      return { args, options, loadingMore, loadMore };
    },
    template: `
      <div class="space-y-4">
        <NSelect 
          v-bind="args" 
          :options="options" 
          :loadingMore="loadingMore"
          @load-more="loadMore"
        />
        <p class="text-xs text-gray-400">Total items loaded: {{ options.length }} / 60</p>
      </div>
    `,
  }),
};

export const WithoutIndicator: Story = {
  args: {
    placeholder: 'No check icon...',
    options: staticOptions,
    showIndicator: false,
  },
};

export const Clearable: Story = {
  args: {
    placeholder: 'Select then clear me...',
    options: staticOptions,
    clearable: true,
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: 'Invalid selection',
    options: staticOptions,
    error: true,
  },
};
