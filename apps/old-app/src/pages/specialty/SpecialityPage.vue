<script setup lang="ts">
import { ref, watch } from 'vue';
import { NDataTable } from '@genrs/ui/components/ui/table';
import { NButton } from '@genrs/ui/components/ui/button';
import { NTextfield } from '@genrs/ui/components/ui/textfield';
import { NIcon as Icon } from '@genrs/ui/components/icons';
import { createColumnHelper, type ColumnDef } from '@tanstack/vue-table';
import { useSpecialty } from './composables/useSpecialty';
import FormSpecialty from './components/FormSpecialty.vue';
import type { SpecialtyModel } from '@/core/domains/models';
import type { SpecialtyParams } from '@/core/domains/inputs';

// 1. Params Configuration (Reactive)
const params = ref<SpecialtyParams>({
  search: '',
  page: 1,
  limit: 10,
  sortBy: 'name',
  sortOrder: 'asc',
});

// 2. Data Fetching via Vue Query
const { specialties, isLoading, isFetching, refetch } = useSpecialty(params);

// 3. Form State
const isFormOpen = ref(false);
const isEdit = ref(false);
const selectedData = ref<SpecialtyModel | undefined>();

const handleAdd = () => {
  isEdit.value = false;
  selectedData.value = undefined;
  isFormOpen.value = true;
};

const handleEdit = (data: SpecialtyModel) => {
  isEdit.value = true;
  selectedData.value = { ...data };
  isFormOpen.value = true;
};

// 4. Table Configuration
const columnHelper = createColumnHelper<SpecialtyModel>();

const columns: ColumnDef<SpecialtyModel, any>[] = [
  columnHelper.accessor('code', {
    header: 'Kode',
  }),
  columnHelper.accessor('name', {
    header: 'Nama Spesialisasi',
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Aksi',
  }),
];

// Debounce search
const searchQuery = ref('');
let debounceTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    params.value.search = newVal;
    params.value.page = 1;
  }, 500);
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-neutral-800">Manajemen Spesialisasi</h1>
        <p class="text-sm text-neutral-500">Kelola daftar spesialisasi tenaga medis rumah sakit.</p>
      </div>
      <div class="flex gap-2">
        <NButton
          variant="outline"
          size="md"
          @click="refetch"
          :disabled="isFetching"
          class="flex items-center gap-2"
        >
          <Icon
            icon="lucide:refresh-cw"
            :class="['w-4 h-4', isFetching ? 'animate-spin' : '']"
          />
          Refresh
        </NButton>
        <NButton @click="handleAdd" class="flex items-center gap-2">
          <Icon icon="lucide:plus" class="w-4 h-4" />
          Tambah Spesialisasi
        </NButton>
      </div>
    </div>

    <!-- Filter Section -->
    <div
      class="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-4"
    >
      <div class="w-full md:w-72">
        <NTextfield v-model="searchQuery" placeholder="Cari kode atau nama..." size="md">
          <template #prefix>
            <Icon icon="lucide:search" class="w-4 h-4" />
          </template>
        </NTextfield>
      </div>
      <div class="ms-auto flex items-center gap-2">
        <span class="text-xs text-neutral-400">
          Showing {{ specialties?.length || 0 }} Items
          <template v-if="isFetching"> (Refreshing...)</template>
        </span>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden p-1">
      <NDataTable
        :columns="columns"
        :data="specialties || []"
        :loading="isLoading"
        class="border-none"
      >
        <!-- Slot: Actions -->
        <template #cell-actions="{ row }">
          <div class="flex gap-2 items-center">
            <NButton
              size="sm"
              variant="ghost"
              class="h-8 w-8 p-0 hover:bg-blue-50"
              @click="handleEdit(row.original)"
            >
              <Icon icon="lucide:pencil" class="w-4 h-4 text-blue-600" />
            </NButton>
            <NButton size="sm" variant="ghost" class="h-8 w-8 p-0 hover:bg-rose-50">
              <Icon icon="lucide:trash-2" class="w-4 h-4 text-rose-600" />
            </NButton>
          </div>
        </template>
      </NDataTable>
    </div>

    <!-- Form Modal -->
    <FormSpecialty
      v-model:open="isFormOpen"
      :is-edit="isEdit"
      :initial-data="selectedData"
      @success="refetch"
    />
  </div>
</template>

<style scoped></style>
