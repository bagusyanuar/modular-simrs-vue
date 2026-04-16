import type { Meta, StoryObj } from '@storybook/vue3';
import { 
  NDialog, 
  NDialogTrigger, 
  NDialogContent, 
  NDialogHeader, 
  NDialogTitle, 
  NDialogDescription, 
  NDialogFooter 
} from './index';
import { NButton } from '../button';
import { NTextfield } from '../textfield';
import { NSwitch } from '../switch';

const meta: Meta<typeof NDialog> = {
  title: 'Components/UI/NDialog',
  component: NDialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NDialog>;

export const Default: Story = {
  render: (args: any) => ({
    components: { 
      NDialog, 
      NDialogTrigger, 
      NDialogContent, 
      NDialogHeader, 
      NDialogTitle, 
      NDialogDescription, 
      NDialogFooter,
      NButton 
    },
    setup() {
      return { args };
    },
    template: `
      <div class="flex h-[400px] items-center justify-center">
        <NDialog v-bind="args">
          <NDialogTrigger as-child>
            <NButton>Open Modal</NButton>
          </NDialogTrigger>
          <NDialogContent>
            <NDialogHeader>
              <NDialogTitle>Penghapusan Data</NDialogTitle>
              <NDialogDescription>
                Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
              </NDialogDescription>
            </NDialogHeader>
            <NDialogFooter class="mt-4">
              <NButton variant="ghost">Batal</NButton>
              <NButton variant="destructive">Hapus Sekarang</NButton>
            </NDialogFooter>
          </NDialogContent>
        </NDialog>
      </div>
    `,
  }),
};

export const ModalForm: Story = {
  render: (args: any) => ({
    components: { 
      NDialog, 
      NDialogTrigger, 
      NDialogContent, 
      NDialogHeader, 
      NDialogTitle, 
      NDialogDescription, 
      NDialogFooter,
      NButton,
      NTextfield,
      NSwitch
    },
    setup() {
      return { args };
    },
    template: `
      <div class="flex h-[400px] items-center justify-center">
        <NDialog v-bind="args">
          <NDialogTrigger as-child>
            <NButton variant="outline">Tambah Instalasi</NButton>
          </NDialogTrigger>
          <NDialogContent class="sm:max-w-[425px]">
            <NDialogHeader>
              <NDialogTitle>Tambah Instalasi</NDialogTitle>
              <NDialogDescription>
                Lengkapi formulir di bawah ini untuk menambahkan instalasi rumah sakit baru.
              </NDialogDescription>
            </NDialogHeader>
            
            <div class="grid gap-6 py-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Kode Instalasi</label>
                <NTextfield placeholder="Contoh: RJ, RI, IGD" />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Nama Instalasi</label>
                <NTextfield placeholder="Masukkan nama lengkap instalasi" />
              </div>
              <div class="flex items-center justify-between rounded-lg border border-stone-100 p-3 shadow-sm">
                <div class="space-y-0.5">
                  <label class="text-sm font-medium">Status Medis</label>
                  <p class="text-xs text-stone-500">Tentukan apakah ini unit medis atau non-medis.</p>
                </div>
                <NSwitch />
              </div>
            </div>

            <NDialogFooter>
              <NButton variant="ghost">Batal</NButton>
              <NButton>Simpan Data</NButton>
            </NDialogFooter>
          </NDialogContent>
        </NDialog>
      </div>
    `,
  }),
};
