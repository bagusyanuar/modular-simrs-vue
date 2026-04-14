import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { 
  NSidebar, 
  NSidebarItem, 
  NSidebarGroup, 
  NSidebarMenuSub, 
  NSidebarMenuSubTrigger, 
  NSidebarMenuSubContent 
} from './index';
import { NButton } from '../button';
import { Icon } from '@iconify/vue';

const meta: Meta<typeof NSidebar> = {
  title: 'Components/UI/NSidebar',
  component: NSidebar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NSidebar>;

export const Default: Story = {
  render: (args: any) => ({
    components: { NSidebar, NSidebarItem, NSidebarGroup, NButton, Icon },
    setup() {
      const isCollapsed = ref(false);
      const activeMenu = ref('Overview');

      const menuItems = [
        { label: 'Overview', icon: 'lucide:layout-dashboard' },
        { label: 'Prescriptions', icon: 'lucide:file-text' },
        { label: 'Reports', icon: 'lucide:bar-chart-3' },
        { label: 'Appointment', icon: 'lucide:calendar' },
        { label: 'Message', icon: 'lucide:message-square' },
        { label: 'Community', icon: 'lucide:users-2' },
      ];

      const settingItems = [
        { label: 'Referrals', icon: 'lucide:user-plus' },
        { label: 'Help', icon: 'lucide:help-circle' },
        { label: 'Settings', icon: 'lucide:settings' },
      ];

      return { args, isCollapsed, activeMenu, menuItems, settingItems };
    },
    template: `
      <div class="flex min-h-[720px] w-full bg-gray-50 font-sans">

        <!-- Sidebar -->
        <NSidebar v-model:collapsed="isCollapsed">

          <!-- Logo -->
          <div :class="['flex items-center gap-3 px-4 pt-6 pb-4', isCollapsed ? 'justify-center' : '']">
            <div class="h-10 w-10 min-w-[40px] bg-brand rounded-2xl flex items-center justify-center text-white shadow-md shadow-brand/30">
              <Icon icon="lucide:stethoscope" style="font-size:1.25rem" />
            </div>
            <div v-if="!isCollapsed" class="overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
              <p class="font-bold text-sm text-gray-900 leading-tight">Balance</p>
              <p class="text-[10px] text-gray-400 uppercase tracking-widest leading-tight mt-0.5">Physiotherapy Center</p>
            </div>
          </div>

          <!-- Main Menu -->
          <NSidebarGroup label="Menu">
            <NSidebarItem
              v-for="item in menuItems"
              :key="item.label"
              :icon="item.icon"
              :active="activeMenu === item.label"
              @click="activeMenu = item.label"
            >
              {{ item.label }}
            </NSidebarItem>
          </NSidebarGroup>

          <!-- Spacer -->
          <div class="flex-1" />

          <!-- Settings Menu -->
          <NSidebarGroup label="Help & Settings">
            <NSidebarItem
              v-for="item in settingItems"
              :key="item.label"
              :icon="item.icon"
              :active="activeMenu === item.label"
              @click="activeMenu = item.label"
            >
              {{ item.label }}
            </NSidebarItem>
          </NSidebarGroup>

          <!-- Toggle -->
          <div :class="['px-3 pt-3 pb-5 flex', isCollapsed ? 'justify-center' : 'justify-end']">
            <button
              @click="isCollapsed = !isCollapsed"
              class="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon :icon="isCollapsed ? 'lucide:chevrons-right' : 'lucide:chevrons-left'" style="font-size:1rem" />
            </button>
          </div>

        </NSidebar>

        <!-- Main Content -->
        <main class="flex-1 min-h-full p-8 overflow-auto">
          <header class="flex justify-between items-center mb-8">
            <h2 class="text-xl font-bold text-gray-800">{{ activeMenu }}</h2>
            <div class="flex items-center gap-3">
              <div class="h-9 w-56 bg-white border border-gray-100 rounded-full px-4 flex items-center gap-2 text-gray-400 shadow-sm">
                <Icon icon="lucide:search" style="font-size:0.9rem" />
                <span class="text-xs">Search...</span>
              </div>
              <div class="h-9 w-9 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                <Icon icon="lucide:bell" style="font-size:0.9rem" />
              </div>
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="avatar"
                class="h-9 w-9 rounded-full border-2 border-white shadow-sm bg-gray-100"
              />
            </div>
          </header>

          <!-- Dashboard Cards -->
          <div class="grid grid-cols-3 gap-5">
            <div class="col-span-2 bg-white rounded-3xl p-8 shadow-sm relative overflow-hidden h-56">
              <div class="relative z-10">
                <h3 class="text-2xl font-bold text-gray-800 mb-1">Hi, Sakura</h3>
                <p class="text-sm text-gray-400 mb-5">Check your health status today.</p>
                <NButton>Schedule Appointment</NButton>
              </div>
              <div class="absolute right-6 bottom-0 opacity-5">
                <Icon icon="lucide:activity" style="font-size:10rem" />
              </div>
            </div>
            <div class="bg-white rounded-3xl p-6 shadow-sm h-56 flex flex-col">
              <p class="font-semibold text-sm text-gray-700 mb-4">Heartbeat</p>
              <div class="flex items-end justify-between flex-1 gap-1">
                <div
                  v-for="(h, i) in [40, 70, 55, 90, 60, 75, 50]"
                  :key="i"
                  class="flex-1 bg-brand/10 rounded-full"
                  :style="{ height: h + '%' }"
                >
                  <div
                    class="w-full bg-brand rounded-full"
                    :style="{ height: '50%' }"
                  />
                </div>
              </div>
              <div class="mt-4 flex justify-between items-baseline">
                <span class="text-xl font-bold text-gray-800">86 bpm</span>
                <span class="text-xs text-brand font-semibold bg-brand/10 px-2 py-0.5 rounded-full">Normal</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    `,
  }),
};

export const Tree: Story = {
  render: (args: any) => ({
    components: {
      NSidebar,
      NSidebarItem,
      NSidebarGroup,
      NSidebarMenuSub,
      NSidebarMenuSubTrigger,
      NSidebarMenuSubContent,
      Icon,
    },
    setup() {
      const isCollapsed = ref(false);
      const activeMenu = ref('Medicine'); // Start with a child active to test auto-expand

      return { args, isCollapsed, activeMenu };
    },
    template: `
      <div class="flex h-[720px] w-full bg-gray-50 p-6 font-sans">
        <NSidebar v-model:collapsed="isCollapsed">
          <div class="p-6">
             <div class="h-10 w-10 bg-brand rounded-2xl flex items-center justify-center text-white shadow-md shadow-brand/30">
                <Icon icon="lucide:stethoscope" style="font-size:1.25rem" />
              </div>
          </div>

          <NSidebarGroup label="Tree Concept">
            <NSidebarItem 
              icon="lucide:layout-dashboard" 
              :active="activeMenu === 'Dashboard'" 
              @click="activeMenu = 'Dashboard'"
            >
              Dashboard
            </NSidebarItem>

            <!-- Nested Sub-menu -->
            <NSidebarMenuSub>
              <NSidebarMenuSubTrigger icon="lucide:package">
                Inventory
              </NSidebarMenuSubTrigger>
              <NSidebarMenuSubContent>
                <NSidebarItem 
                  :active="activeMenu === 'Medicine'" 
                  @click="activeMenu = 'Medicine'"
                >
                  Medicine
                </NSidebarItem>
                <NSidebarItem 
                  :active="activeMenu === 'Equipment'" 
                  @click="activeMenu = 'Equipment'"
                >
                  Equipment
                </NSidebarItem>
              </NSidebarMenuSubContent>
            </NSidebarMenuSub>

            <NSidebarItem 
              icon="lucide:users" 
              :active="activeMenu === 'Staff'" 
              @click="activeMenu = 'Staff'"
            >
              Staff Management
            </NSidebarItem>
          </NSidebarGroup>

          <div class="flex-1" />

          <div :class="['p-4 flex', isCollapsed ? 'justify-center' : 'justify-end']">
            <button
              @click="isCollapsed = !isCollapsed"
              class="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400"
            >
              <Icon :icon="isCollapsed ? 'lucide:chevrons-right' : 'lucide:chevrons-left'" />
            </button>
          </div>
        </NSidebar>

        <main class="flex-1 p-8">
           <h2 class="text-xl font-bold text-gray-800">Active Page: {{ activeMenu }}</h2>
           <p class="text-gray-400 mt-2">Notice that 'Inventory' parent is expanded automatically because 'Medicine' is active.</p>
        </main>
      </div>
    `,
  }),
};
