<script setup lang="ts" generic="TData, TValue">
import { computed, ref, watch } from 'vue';
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  FlexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/vue-table';
import NTable from './NTable.vue';
import NTableHeader from './NTableHeader.vue';
import NTableBody from './NTableBody.vue';
import NTableRow from './NTableRow.vue';
import NTableHead from './NTableHead.vue';
import NTableCell from './NTableCell.vue';
import NPagination from './NPagination.vue';

const props = withDefaults(
  defineProps<{
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    isLoading?: boolean;
    collapsible?: boolean;
  }>(),
  {
    pagination: true,
    pageSize: 10,
    pageSizeOptions: () => [10, 20, 50, 100],
  },
);

const sorting = ref<SortingState>([]);
const expanded = ref({});
const rowSelection = ref({});
const internalPageSize = ref(props.pageSize);

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get expanded() {
      return expanded.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
  },
  enableRowSelection: true,
  onSortingChange: (updater) => {
    sorting.value =
      typeof updater === 'function' ? updater(sorting.value) : updater;
  },
  onExpandedChange: (updater) => {
    expanded.value =
      typeof updater === 'function' ? updater(expanded.value) : updater;
  },
  onRowSelectionChange: (updater) => {
    rowSelection.value =
      typeof updater === 'function' ? updater(rowSelection.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  initialState: {
    pagination: {
      pageSize: props.pageSize,
    },
  },
});

watch(internalPageSize, (val) => {
  table.setPageSize(val);
});

defineExpose({
  table,
});
</script>

<template>
  <div class="space-y-4">
    <div
      class="rounded-lg border border-gray-100 bg-white shadow-xl shadow-gray-200/40 overflow-hidden"
    >
      <NTable>
        <NTableHeader>
          <NTableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <NTableHead v-for="header in headerGroup.headers" :key="header.id">
              <span v-if="!header.isPlaceholder">
                <FlexRender
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </span>
            </NTableHead>
          </NTableRow>
        </NTableHeader>
        <NTableBody class="relative">
          <!-- Loading Overlay -->
          <div
            v-if="isLoading"
            class="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[2px]"
          >
            <slot name="loading">
              <div
                class="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"
              ></div>
            </slot>
          </div>

          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <NTableRow :selected="row.getIsSelected()">
                <NTableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <slot
                    :name="`cell-${cell.column.id}`"
                    :row="row"
                    :value="cell.getValue()"
                  >
                    <FlexRender
                      :render="cell.column.columnDef.cell"
                      :props="cell.getContext()"
                    />
                  </slot>
                </NTableCell>
              </NTableRow>
              <!-- Expanded Row Slot -->
              <NTableRow v-if="row.getIsExpanded()" class="bg-gray-50/30">
                <NTableCell :colspan="row.getAllCells().length">
                  <slot name="expanded-row" :row="row" />
                </NTableCell>
              </NTableRow>
            </template>
          </template>
          <NTableRow v-else>
            <NTableCell
              :colspan="columns.length"
              class="h-32 text-center text-gray-400"
            >
              <slot name="empty">No results found.</slot>
            </NTableCell>
          </NTableRow>
        </NTableBody>
      </NTable>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && data.length > 0" class="py-2">
      <NPagination
        v-model:items-per-page="internalPageSize"
        :total="data.length"
        :page-size-options="pageSizeOptions"
        :page="table.getState().pagination.pageIndex + 1"
        @update:page="(v) => table.setPageIndex(v - 1)"
      />
    </div>
  </div>
</template>
