<script setup lang="ts">
import { watch } from 'vue';
import {
  NDialog,
  NDialogContent,
  NDialogHeader,
  NDialogTitle,
  NDialogDescription,
  NDialogFooter,
} from '@genrs/ui/components/ui/dialog';
import { NButton } from '@genrs/ui/components/ui/button';
import { NTextfield } from '@genrs/ui/components/ui/textfield';
import { NHelperText } from '@genrs/ui/components/ui/helper-text';
import { useFormSpecialty } from '../composables/useFormSpecialty';
import type { SpecialtyForm } from '@/core/domains/inputs';

interface Props {
  open: boolean;
  isEdit?: boolean;
  initialData?: Partial<SpecialtyForm> & { id?: string };
}

const props = defineProps<Props>();
const emit = defineEmits(['update:open', 'success']);

// 1. Consume Form Logic
const {
  code,
  codeProps,
  name,
  nameProps,
  errors,
  isPending,
  onSubmit,
  resetForm,
  setInitialValues,
} = useFormSpecialty((event, ...args) => emit(event, ...args));

// 2. Sync initial data when opening/editing
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      if (props.isEdit && props.initialData) {
        setInitialValues(props.initialData);
      } else {
        resetForm();
      }
    }
  },
  { immediate: true }
);

const handleUpdateOpen = (val: boolean) => {
  emit('update:open', val);
};
</script>

<template>
  <NDialog :open="props.open" @update:open="handleUpdateOpen">
    <NDialogContent class="sm:max-w-[480px]">
      <NDialogHeader>
        <NDialogTitle>{{ props.isEdit ? 'Edit Spesialisasi' : 'Tambah Spesialisasi Baru' }}</NDialogTitle>
        <NDialogDescription>
          Silahkan lengkapi informasi spesialisasi tenaga medis di bawah ini.
        </NDialogDescription>
      </NDialogHeader>

      <form @submit.prevent="onSubmit" class="grid gap-6 py-6 font-sans">
        <!-- Field: Kode -->
        <div class="grid gap-2">
          <label for="code" class="text-sm font-semibold text-stone-700">Kode Spesialisasi</label>
          <NTextfield
            id="code"
            v-model="code"
            v-bind="codeProps"
            placeholder="Contoh: SP-PD, SP-A"
            :error="!!errors.code"
            autocomplete="off"
            class="focus:ring-brand"
          />
          <NHelperText v-if="errors.code" variant="error">{{ errors.code }}</NHelperText>
          <p v-else class="text-[10px] text-stone-400 italic">
            * Kode unik untuk identifikasi spesialisasi.
          </p>
        </div>

        <!-- Field: Nama -->
        <div class="grid gap-2">
          <label for="name" class="text-sm font-semibold text-stone-700">Nama Spesialisasi</label>
          <NTextfield
            id="name"
            v-model="name"
            v-bind="nameProps"
            placeholder="Masukkan nama lengkap spesialisasi"
            :error="!!errors.name"
            autocomplete="off"
          />
          <NHelperText v-if="errors.name" variant="error">{{ errors.name }}</NHelperText>
        </div>

        <NDialogFooter class="border-t border-stone-100 pt-4">
          <NButton variant="ghost" type="button" @click="handleUpdateOpen(false)">Batal</NButton>
          <NButton type="submit" :disabled="isPending" class="min-w-[120px] transition-all">
            <template v-if="isPending">Menyimpan...</template>
            <template v-else>
              {{ props.isEdit ? 'Simpan Perubahan' : 'Tambah Spesialisasi' }}
            </template>
          </NButton>
        </NDialogFooter>
      </form>
    </NDialogContent>
  </NDialog>
</template>
