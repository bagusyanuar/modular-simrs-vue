<script setup lang="ts">
import { getEnv } from '@genrs/utils';
import { NTypography } from 'tamtech-neurovi-dev-libs/ui/components/typography';
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <NTypography variant="heading-1" cek="coba"
      >Dashboard Master Data (MDM) - GenRS</NTypography
    >
    <div class="container mx-auto py-8">
      <h1 class="text-3xl font-bold text-slate-800 mb-6">
        Dashboard Master Data (MDM) - GenRS
      </h1>

      <div class="bg-white rounded-lg shadow p-6 mb-8 border border-slate-100">
        <h2 class="text-2xl font-semibold text-slate-800 mb-4">
          Configuration
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-slate-500 font-medium">Environment Mode:</span>
            <span class="text-slate-800 ml-2 font-semibold">{{
              getEnv('NODE_ENV') || 'production'
            }}</span>
          </div>
          <div>
            <span class="text-slate-500 font-medium">Tenant Code:</span>
            <span class="text-slate-800 ml-2 font-semibold">{{
              getEnv('VITE_TENANT_CODE') || 'N/A'
            }}</span>
          </div>
          <div>
            <span class="text-slate-500 font-medium">API URL:</span>
            <span class="text-slate-800 ml-2 font-semibold">{{
              getEnv('VITE_API_URL')
            }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6 border border-slate-100">
          <h2 class="text-2xl font-semibold text-slate-800 mb-4">Dokter</h2>
          <p class="text-slate-600 mb-4">
            Kelola data dokter, jadwal, dan tindakan medis
          </p>
          <div class="space-y-2">
            <router-link
              to="/master-data/dokter"
              class="block w-full bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-lg transition"
            >
              Lihat Daftar
            </router-link>
            <router-link
              to="/master-data/dokter/new"
              class="block w-full bg-white hover:bg-slate-50 text-violet-600 py-2 px-4 rounded-lg border border-violet-200 transition"
            >
              Tambah Baru
            </router-link>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border border-slate-100">
          <h2 class="text-2xl font-semibold text-slate-800 mb-4">Pasien</h2>
          <p class="text-slate-600 mb-4">Kelola data pasien dan rekam medis</p>
          <div class="space-y-2">
            <router-link
              to="/pasien"
              class="block w-full bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-lg transition"
            >
              Lihat Daftar
            </router-link>
            <router-link
              to="/pasien/new"
              class="block w-full bg-white hover:bg-slate-50 text-rose-600 py-2 px-4 rounded-lg border border-rose-200 transition"
            >
              Tambah Baru
            </router-link>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border border-slate-100">
          <h2 class="text-2xl font-semibold text-slate-800 mb-4">
            Kamar Rawat
          </h2>
          <p class="text-slate-600 mb-4">
            Kelola ketersediaan dan penempatan kamar
          </p>
          <div class="space-y-2">
            <router-link
              to="/master-data/kamar-rawat"
              class="block w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg transition"
            >
              Lihat Daftar
            </router-link>
            <router-link
              to="/master-data/kamar-rawat/new"
              class="block w-full bg-white hover:bg-slate-50 text-cyan-600 py-2 px-4 rounded-lg border border-cyan-200 transition"
            >
              Tambah Baru
            </router-link>
          </div>
        </div>
      </div>

      <div class="mt-8 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <p class="text-sm text-yellow-800">
          <span class="font-semibold">💡 Info:</span> Aplikasi ini berjalan
          dalam mode isolated tenant. Semua data bersifat lokal/dummy.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
