<script lang="ts" setup>
import {
  Sidebar,
  SidebarHeader,
  SidebarGroup,
  SidebarItem,
  SidebarCollapsible,
  SidebarAppSwitcher,
  SidebarUserNav
} from './Sidebar';
import {
  LayoutDashboard,
  Database,
  Tags,
  Truck,
  Warehouse,
  ShoppingCart,
  FileInput,
  FileOutput,
  Layers,
  ArrowLeftRight,
  ClipboardCheck,
  FileBarChart,
  AlertCircle,
  FileText,
  Settings,
  LogOut,
  User,
  Stethoscope,
  HeartPulse,
  CircleDollarSign,
  Users,
  Package,
} from 'lucide-vue-next';

const apps = [
  {
    name: 'Inventory',
    description: 'Logistik & Farmasi',
    icon: Package,
    color: 'bg-indigo-600',
  },
  {
    name: 'SIMRS EMR',
    description: 'Pelayanan Pasien',
    icon: HeartPulse,
    color: 'bg-teal-600',
    url: import.meta.env.VITE_V1_APP_URL,
  },
  {
    name: 'Finance',
    description: 'Keuangan & Akuntansi',
    icon: CircleDollarSign,
    color: 'bg-amber-600',
  },
  {
    name: 'HR System',
    description: 'Kepegawaian',
    icon: Users,
    color: 'bg-rose-600',
  },
];
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- Sidebar -->
    <Sidebar>
      <template #header>
        <SidebarHeader title="Neurovi" subtitle="Hospital System" />
        <SidebarAppSwitcher :apps="apps" current-app-name="Inventory" />
      </template>

      <!-- Dashboard -->
      <SidebarGroup>
        <SidebarItem
          :icon="LayoutDashboard"
          title="Dashboard Overview"
          active
        />
      </SidebarGroup>

      <!-- Master Data -->
      <SidebarGroup label="Master Data">
        <SidebarCollapsible :icon="Database" title="Referensi">
          <SidebarItem :icon="Stethoscope" title="Obat & Alkes" />
          <SidebarItem :icon="Tags" title="Kategori Barang" />
          <SidebarItem :icon="Warehouse" title="Gudang / Depo" />
          <SidebarItem :icon="Truck" title="Supplier (PBF)" />
        </SidebarCollapsible>
      </SidebarGroup>

      <!-- Transaksi -->
      <SidebarGroup label="Transaksi">
        <SidebarCollapsible :icon="ShoppingCart" title="Pengadaan">
          <SidebarItem :icon="FileText" title="Purchase Order" />
          <SidebarItem :icon="FileInput" title="Penerimaan Barang" />
        </SidebarCollapsible>

        <SidebarCollapsible :icon="Layers" title="Manajemen Stok">
          <SidebarItem :icon="ClipboardCheck" title="Stok Opname" />
          <SidebarItem :icon="ArrowLeftRight" title="Mutasi Barang" />
          <SidebarItem :icon="FileOutput" title="Retur Barang" />
        </SidebarCollapsible>

        <SidebarCollapsible :icon="FileOutput" title="Distribusi">
          <SidebarItem :icon="FileText" title="Permintaan Ruangan" />
          <SidebarItem :icon="ArrowLeftRight" title="Penyaluran Barang" />
        </SidebarCollapsible>
      </SidebarGroup>

      <!-- Monitoring & Reports -->
      <SidebarGroup label="Monitoring">
        <SidebarItem :icon="AlertCircle" title="Masa Kadaluwarsa" badge="5" />
        <SidebarItem :icon="FileBarChart" title="Laporan Stok" />
        <SidebarItem :icon="FileText" title="Kartu Stok" />
      </SidebarGroup>

      <template #footer>
        <div class="flex flex-col gap-4">
          <SidebarItem :icon="Settings" title="Settings" />
          <SidebarUserNav :user="{ name: 'Bagus Yanuar', role: 'Administrator' }" />
        </div>
      </template>
    </Sidebar>

    <!-- Main Content -->
    <main class="pl-72 transition-all duration-300">
      <div class="p-8">
        <header class="mb-8">
          <h1
            class="text-3xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            Dashboard Overview
          </h1>
          <p class="text-slate-500 dark:text-slate-400">
            Welcome back, here's what's happening with your inventory today.
          </p>
        </header>

        <!-- Placeholder for content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="i in 3"
            :key="i"
            class="h-32 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm p-6"
          >
            <div class="h-2 w-24 bg-slate-100 dark:bg-slate-800 rounded mb-4" />
            <div class="h-8 w-16 bg-slate-50 dark:bg-slate-800/50 rounded" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
