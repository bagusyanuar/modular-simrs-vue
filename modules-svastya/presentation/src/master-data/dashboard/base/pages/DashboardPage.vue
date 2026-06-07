<script setup lang="ts">
import { ref, computed } from 'vue';

interface StatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  color: string;
  icon: string;
}

interface PatientAdmission {
  id: string;
  name: string;
  age: number;
  gender: 'L' | 'P';
  room: string;
  doctor: string;
  status: 'Rawat Jalan' | 'Rawat Inap' | 'IGD';
  time: string;
}

const selectedDepartment = ref<string>('Semua');
const searchAdmissionQuery = ref<string>('');

const stats = ref<StatItem[]>([
  {
    id: '1',
    title: 'Total Kunjungan Hari Ini',
    value: '342 Pasien',
    change: '+12.5% dari kemarin',
    isPositive: true,
    color: 'emerald',
    icon: 'patients',
  },
  {
    id: '2',
    title: 'Kamar Terisi (BOR)',
    value: '78%',
    change: '156/200 Bed terisi',
    isPositive: true,
    color: 'indigo',
    icon: 'bed',
  },
  {
    id: '3',
    title: 'Dokter Bertugas',
    value: '24 Spesialis',
    change: '3 On-Call',
    isPositive: true,
    color: 'teal',
    icon: 'doctor',
  },
  {
    id: '4',
    title: 'Resep Obat Keluar',
    value: '189 Resep',
    change: '-4% dari rata-rata',
    isPositive: false,
    color: 'amber',
    icon: 'pharmacy',
  },
]);

const recentAdmissions = ref<PatientAdmission[]>([
  { id: '1', name: 'Budi Santoso', age: 45, gender: 'L', room: 'Poli Dalam', doctor: 'dr. Andi Wijaya, Sp.PD', status: 'Rawat Jalan', time: '10:15' },
  { id: '2', name: 'Siti Aminah', age: 29, gender: 'P', room: 'Flamboyan - Room 204', doctor: 'dr. Rina Lestari, Sp.A', status: 'Rawat Inap', time: '09:40' },
  { id: '3', name: 'Joko Susilo', age: 34, gender: 'L', room: 'IGD Bed 03', doctor: 'dr. Eko Prasetyo', status: 'IGD', time: '09:12' },
  { id: '4', name: 'Dewi Lestari', age: 52, gender: 'P', room: 'Poli Jantung', doctor: 'dr. Haryono, Sp.JP', status: 'Rawat Jalan', time: '08:50' },
  { id: '5', name: 'Rian Hidayat', age: 19, gender: 'L', room: 'Melati - Room 102', doctor: 'dr. Andi Wijaya, Sp.PD', status: 'Rawat Inap', time: '08:15' },
]);

const filteredAdmissions = computed<PatientAdmission[]>(() => {
  return recentAdmissions.value.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchAdmissionQuery.value.toLowerCase()) ||
                          item.doctor.toLowerCase().includes(searchAdmissionQuery.value.toLowerCase());
    
    if (selectedDepartment.value === 'Semua') return matchesSearch;
    if (selectedDepartment.value === 'Rawat Inap') return item.status === 'Rawat Inap' && matchesSearch;
    if (selectedDepartment.value === 'Rawat Jalan') return item.status === 'Rawat Jalan' && matchesSearch;
    if (selectedDepartment.value === 'Emergency') return item.status === 'IGD' && matchesSearch;
    
    return matchesSearch;
  });
});
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Top Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Utama</h1>
          <p class="text-sm text-slate-500 mt-0.5">Svastya SIMRS &bull; Pemantauan Realtime Fasilitas & Pasien</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-xs font-semibold text-slate-600 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Sistem Terkoneksi (Realtime)
          </div>
          <button class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/15 transition-all cursor-pointer">
            Registrasi Baru
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="stat in stats" 
          :key="stat.id"
          class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
        >
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ stat.title }}</span>
              <h3 class="text-2xl font-extrabold text-slate-800 tracking-tight">{{ stat.value }}</h3>
            </div>
            
            <div 
              class="p-2.5 rounded-xl border transition-colors"
              :class="{
                'bg-emerald-50 border-emerald-100 text-emerald-600': stat.color === 'emerald',
                'bg-indigo-50 border-indigo-100 text-indigo-600': stat.color === 'indigo',
                'bg-teal-50 border-teal-100 text-teal-600': stat.color === 'teal',
                'bg-amber-50 border-amber-100 text-amber-600': stat.color === 'amber',
              }"
            >
              <!-- SVG Icons based on color/type -->
              <svg v-if="stat.icon === 'patients'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <svg v-else-if="stat.icon === 'bed'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 4v16M2 8h18M2 12h18M20 4v16M2 16h18" />
              </svg>
              <svg v-else-if="stat.icon === 'doctor'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 17v-5h6v5M9 7h6" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                <path d="m8.5 8.5 7 7" />
              </svg>
            </div>
          </div>
          
          <div class="mt-4 flex items-center gap-1.5 text-xs">
            <span 
              class="font-bold flex items-center"
              :class="stat.isPositive ? 'text-emerald-600' : 'text-rose-500'"
            >
              {{ stat.isPositive ? '▲' : '▼' }}
            </span>
            <span class="text-slate-500">{{ stat.change }}</span>
          </div>
        </div>
      </div>

      <!-- Main Section: List & Filter -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        <!-- Filter Bar -->
        <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            <button 
              v-for="dept in ['Semua', 'Rawat Jalan', 'Rawat Inap', 'Emergency']" 
              :key="dept"
              @click="selectedDepartment = dept"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              :class="selectedDepartment === dept 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'"
            >
              {{ dept }}
            </button>
          </div>

          <div class="relative w-full sm:max-w-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input 
              type="text" 
              v-model="searchAdmissionQuery"
              placeholder="Cari pasien / dokter..."
              class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <!-- Admissions Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Pasien</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Lokasi / Kamar</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Dokter PJ</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status Admisi</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Jam Masuk</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="patient in filteredAdmissions" 
                :key="patient.id"
                class="hover:bg-slate-50/30 transition-colors"
              >
                <!-- Patient Info -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                      {{ patient.name.charAt(0) }}
                    </div>
                    <div>
                      <span class="text-sm font-semibold text-slate-700 block">{{ patient.name }}</span>
                      <span class="text-xs text-slate-400">{{ patient.age }} Thn &bull; {{ patient.gender }}</span>
                    </div>
                  </div>
                </td>
                
                <!-- Location -->
                <td class="px-6 py-4">
                  <span class="text-xs font-medium text-slate-600">{{ patient.room }}</span>
                </td>
                
                <!-- Doctor -->
                <td class="px-6 py-4">
                  <span class="text-xs font-medium text-slate-600">{{ patient.doctor }}</span>
                </td>
                
                <!-- Status -->
                <td class="px-6 py-4">
                  <span 
                    class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block"
                    :class="{
                      'bg-emerald-50 text-emerald-600 border border-emerald-100': patient.status === 'Rawat Jalan',
                      'bg-indigo-50 text-indigo-600 border border-indigo-100': patient.status === 'Rawat Inap',
                      'bg-rose-50 text-rose-600 border border-rose-100': patient.status === 'IGD',
                    }"
                  >
                    {{ patient.status }}
                  </span>
                </td>

                <!-- Time -->
                <td class="px-6 py-4 text-right">
                  <span class="text-xs font-semibold text-slate-500">{{ patient.time }} WIB</span>
                </td>
              </tr>

              <tr v-if="filteredAdmissions.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-xs font-medium text-slate-400">
                  Tidak ada data pasien yang sesuai pencarian.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
      </div>

    </div>
  </div>
</template>
