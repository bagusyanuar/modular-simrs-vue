<script setup lang="ts">
import { ref } from 'vue';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Package, 
  AlertTriangle, 
  Calendar,
  Warehouse,
  History
} from 'lucide-vue-next';

// Dummy Data
const stocks = ref([
  { id: 1, name: 'Paracetamol 500mg Tab', code: 'OBT-001', warehouse: 'Gudang Utama', qty: 1250, unit: 'Tablet', expiry: '2027-12-10', status: 'Available' },
  { id: 2, name: 'Amoxicillin 250mg Cap', code: 'OBT-002', warehouse: 'Depo Farmasi 1', qty: 45, unit: 'Capsule', expiry: '2024-05-15', status: 'Low Stock' },
  { id: 3, name: 'Infus RL 500ml', code: 'ALKES-089', warehouse: 'Gudang Utama', qty: 200, unit: 'Botol', expiry: '2026-08-20', status: 'Available' },
  { id: 4, name: 'Hand Sanitizer 5L', code: 'BMHP-012', warehouse: 'Logistik Umum', qty: 5, unit: 'Jerigen', expiry: '2024-12-01', status: 'Low Stock' },
  { id: 5, name: 'Masker Bedah 3ply', code: 'BMHP-044', warehouse: 'Gudang Utama', qty: 0, unit: 'Box', expiry: '-', status: 'Out of Stock' },
]);

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Available': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'Low Stock': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'Out of Stock': return 'bg-rose-50 text-rose-600 border-rose-100';
    default: return 'bg-slate-50 text-slate-600';
  }
};
</script>

<template>
  <div class="p-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">Stock Management</h1>
        <p class="text-slate-500 dark:text-slate-400 font-medium">Monitoring stok obat dan alkes real-time.</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all">
          <Download class="h-4 w-4" />
          Export
        </button>
        <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <Plus class="h-4 w-4" />
          Tambah Stok
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
            <Package class="h-6 w-6" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Items</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white">1,240</h3>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
            <AlertTriangle class="h-6 w-6" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Low Stock</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white">12</h3>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
            <Calendar class="h-6 w-6" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expiring Soon</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white">8</h3>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
            <History class="h-6 w-6" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Activities</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white">45</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters & Table -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama barang atau kode..." 
            class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <div class="flex items-center gap-2">
          <button class="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600">
            <Warehouse class="h-3.5 w-3.5" />
            Semua Gudang
          </button>
          <button class="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600">
            <Filter class="h-3.5 w-3.5" />
            Filter
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
            <tr>
              <th class="px-6 py-4">Item Details</th>
              <th class="px-6 py-4">Warehouse</th>
              <th class="px-6 py-4 text-right">Quantity</th>
              <th class="px-6 py-4">Expiry Date</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="stock in stocks" :key="stock.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors text-sm">{{ stock.name }}</span>
                  <span class="text-[10px] text-slate-400 font-medium tracking-wider">{{ stock.code }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-medium text-slate-600 dark:text-slate-400">{{ stock.warehouse }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex flex-col">
                  <span class="font-black text-slate-900 dark:text-white">{{ stock.qty.toLocaleString() }}</span>
                  <span class="text-[10px] text-slate-400">{{ stock.unit }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-medium" :class="stock.expiry.includes('2024') ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400'">
                  {{ stock.expiry }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span 
                  :class="[getStatusClass(stock.status), 'px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider']"
                >
                  {{ stock.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-slate-400 hover:text-primary transition-colors">
                  <History class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
