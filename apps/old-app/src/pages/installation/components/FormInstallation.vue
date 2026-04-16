<script setup lang="ts">
import { watch } from 'vue';
import { 
  NDialog, 
  NDialogContent, 
  NDialogHeader, 
  NDialogTitle, 
  NDialogDescription, 
  NDialogFooter 
} from '@genrs/ui/components/ui/dialog';
import { NButton } from '@genrs/ui/components/ui/button';
import { NTextfield } from '@genrs/ui/components/ui/textfield';
import { NSwitch } from '@genrs/ui/components/ui/switch';
import { NHelperText } from '@genrs/ui/components/ui/helper-text';
import { useFormInstallation } from '../composables/useFormInstallation';
import type { InstallationForm } from '@/core/domains/inputs';

interface Props {
  open: boolean;
  isEdit?: boolean;
  initialData?: Partial<InstallationForm> & { id?: string };
}

const props = defineProps<Props>();
const emit = defineEmits(['update:open', 'success']);

// 1. Consume Form Logic
const {
  code,
  codeProps,
  name,
  nameProps,
  isMedical,
  isActive,
  errors,
  isPending,
  onSubmit,
  resetForm,
  setInitialValues,
} = useFormInstallation((event, ...args) => emit(event, ...args));

// 2. Sync initial data when opening/editing
watch(() => props.open, (newVal) => {
  if (newVal) {
    if (props.isEdit && props.initialData) {
      setInitialValues(props.initialData);
    } else {
      resetForm();
    }
  }
}, { immediate: true });

const handleUpdateOpen = (val: boolean) => {
  emit('update:open', val);
};
</script>

<template>
  <NDialog :open="props.open" @update:open="handleUpdateOpen">
    <NDialogContent class="sm:max-w-[480px]">
      <NDialogHeader>
        <NDialogTitle>{{ props.isEdit ? 'Edit Instalasi' : 'Tambah Instalasi Baru' }}</NDialogTitle>
        <NDialogDescription>
          Silahkan lengkapi informasi instalasi rumah sakit di bawah ini.
        </NDialogDescription>
      </NDialogHeader>

      <form @submit.prevent="onSubmit" class="grid gap-6 py-6 font-sans">
        <!-- Field: Kode -->
        <div class="grid gap-2">
          <label for="code" class="text-sm font-semibold text-stone-700">Kode Instalasi</label>
          <NTextfield 
            id="code" 
            v-model="code" 
            v-bind="codeProps"
            placeholder="Contoh: RJ, RI, IGD" 
            :error="!!errors.code"
            autocomplete="off"
            class="focus:ring-brand"
          />
          <NHelperText v-if="errors.code" variant="error">{{ errors.code }}</NHelperText>
          <p v-else class="text-[10px] text-stone-400 italic">* Kode unik untuk identifikasi instalasi.</p>
        </div>

        <!-- Field: Nama -->
        <div class="grid gap-2">
          <label for="name" class="text-sm font-semibold text-stone-700">Nama Instalasi</label>
          <NTextfield 
            id="name" 
            v-model="name" 
            v-bind="nameProps"
            placeholder="Masukkan nama lengkap instalasi" 
            :error="!!errors.name"
            autocomplete="off"
          />
          <NHelperText v-if="errors.name" variant="error">{{ errors.name }}</NHelperText>
        </div>

        <!-- Field: Toggles -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-3 rounded-xl border border-stone-100 bg-stone-50/50 p-4 transition-colors hover:bg-stone-50">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-stone-700">Unit Medis</span>
              <NSwitch v-model="isMedical" size="sm" />
            </div>
            <p class="text-[10px] text-stone-500 leading-relaxed">
              Aktifkan jika instalasi ini merupakan unit pelayanan medis.
            </p>
          </div>

          <div class="flex flex-col gap-3 rounded-xl border border-stone-100 bg-stone-50/50 p-4 transition-colors hover:bg-stone-50">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-stone-700">Status Aktif</span>
              <NSwitch v-model="isActive" size="sm" />
            </div>
            <p class="text-[10px] text-stone-500 leading-relaxed">
              Tentukan apakah instalasi ini siap digunakan dalam sistem.
            </p>
          </div>
        </div>

        <NDialogFooter class="border-t border-stone-100 pt-4">
          <NButton variant="ghost" type="button" @click="handleUpdateOpen(false)">Batal</NButton>
          <NButton 
            type="submit" 
            :disabled="isPending" 
            class="min-w-[120px] transition-all"
          >
            <template v-if="isPending">Menyimpan...</template>
            <template v-else>
              {{ props.isEdit ? 'Simpan Perubahan' : 'Tambah Instalasi' }}
            </template>
          </NButton>
        </NDialogFooter>
      </form>
    </NDialogContent>
  </NDialog>
</template>
