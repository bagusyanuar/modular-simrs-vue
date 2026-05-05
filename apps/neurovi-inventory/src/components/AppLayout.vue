<script lang="ts" setup>
import {
  Sidebar,
  SidebarHeader,
  SidebarGroup,
  SidebarItem,
  SidebarCollapsible,
  SidebarAppSwitcher,
  SidebarUserNav,
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
  Box,
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
        <SidebarItem :icon="Box" title="Stok" to="/stock" />
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
          <SidebarUserNav
            :user="{ name: 'Bagus Yanuar', role: 'Administrator' }"
          />
        </div>
      </template>
    </Sidebar>

    <!-- Main Content -->
    <main class="pl-72 transition-all duration-300">
      <RouterView />
    </main>
  </div>
</template>
