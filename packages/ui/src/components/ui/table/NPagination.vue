<script setup lang="ts">
import { computed } from 'vue';
import {
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'reka-ui';
import { Icon } from '@iconify/vue';
import { NButton } from '../button';
import { NPopover, NPopoverTrigger, NPopoverContent } from '../popover';

interface Props {
  total: number;
  itemsPerPage?: number;
  pageSizeOptions?: number[];
  siblingCount?: number;
  showEdges?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 10,
  pageSizeOptions: () => [10, 20, 50, 100],
  siblingCount: 1,
  showEdges: true,
});

const page = defineModel<number>('page', { default: 1 });
const itemsPerPageModel = defineModel<number>('itemsPerPage', { default: 10 });

const from = computed(() => (page.value - 1) * itemsPerPageModel.value + 1);
const to = computed(() => Math.min(page.value * itemsPerPageModel.value, props.total));
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <!-- Left: Info & Page Size -->
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Show</span>
        <NPopover>
          <NPopoverTrigger as-child>
            <NButton variant="outline" size="sm" class="h-8 px-2 gap-2 text-xs font-bold border-gray-200 rounded-lg">
              {{ itemsPerPageModel }}
              <Icon icon="lucide:chevron-down" class="h-3 w-3 text-gray-400" />
            </NButton>
          </NPopoverTrigger>
          <NPopoverContent class="w-20 p-1 flex flex-col gap-1 rounded-lg border-gray-100 shadow-xl" :side-offset="5">
             <button
                v-for="opt in pageSizeOptions"
                :key="opt"
                class="px-2 py-1.5 text-xs font-medium text-left rounded-md hover:bg-gray-50 transition-colors"
                :class="itemsPerPageModel === opt ? 'text-brand bg-brand/5' : 'text-gray-600'"
                @click="itemsPerPageModel = opt"
             >
                {{ opt }}
             </button>
          </NPopoverContent>
        </NPopover>
      </div>

      <span class="text-[11px] font-medium text-gray-400">
        Showing <span class="text-gray-900 font-bold">{{ from }}</span> to <span class="text-gray-900 font-bold">{{ to }}</span> of <span class="text-gray-900 font-bold">{{ total }}</span> entries
      </span>
    </div>

    <!-- Right: Pagination Control -->
    <PaginationRoot
      v-model:page="page"
      :total="total"
      :items-per-page="itemsPerPageModel"
      :sibling-count="siblingCount"
      :show-edges="showEdges"
      class="flex items-center"
    >
      <div class="flex items-center gap-1">
        <PaginationPrev as-child>
          <NButton variant="ghost" size="sm" class="h-9 w-9 p-0 text-gray-400 border-none hover:bg-transparent hover:text-gray-900 transition-colors">
            <Icon icon="lucide:chevron-left" class="h-4 w-4" />
          </NButton>
        </PaginationPrev>

        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <template v-for="(item, index) in items">
            <PaginationListItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <NButton
                :variant="item.type === 'page' && item.value === page ? 'primary' : 'ghost'"
                size="sm"
                class="h-9 w-9 p-0 rounded-lg text-xs font-bold transition-all"
                :class="item.type === 'page' && item.value !== page && 'text-gray-500 hover:bg-gray-100'"
              >
                {{ item.type === 'page' ? item.value : '' }}
              </NButton>
            </PaginationListItem>
            <PaginationEllipsis
              v-else
              :key="item.type"
              :index="index"
              class="flex h-9 w-9 items-center justify-center text-xs text-gray-400"
            >
              &#8230;
            </PaginationEllipsis>
          </template>
        </PaginationList>

        <PaginationNext as-child>
          <NButton variant="ghost" size="sm" class="h-9 w-9 p-0 text-gray-400 border-none hover:bg-transparent hover:text-gray-900 transition-colors">
            <Icon icon="lucide:chevron-right" class="h-4 w-4" />
          </NButton>
        </PaginationNext>
      </div>
    </PaginationRoot>
  </div>
</template>
