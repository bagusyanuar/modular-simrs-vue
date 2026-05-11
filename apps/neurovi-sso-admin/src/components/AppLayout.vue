<script lang="ts" setup>
import {
  Sidebar,
  SidebarHeader,
  SidebarGroup,
  SidebarItem,
  SidebarCollapsible,
  SidebarAppSwitcher,
  SidebarUserNav,
  type AppInfo,
} from '@genrs/ui/components/ui/sidebar/new';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Key,
  Globe,
  Settings,
  Lock,
  Package,
  HeartPulse,
  CircleDollarSign,
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const apps: AppInfo[] = [
  {
    name: 'SSO Admin',
    description: 'Security & Auth Management',
    icon: ShieldCheck,
    color: 'bg-slate-900',
  },
  {
    name: 'Inventory',
    description: 'Logistik & Farmasi',
    icon: Package,
    color: 'bg-indigo-600',
    url: 'https://inventory.neurovi-local.test:5173', // Adjust as needed
  },
  {
    name: 'Finance',
    description: 'Keuangan & Akuntansi',
    icon: CircleDollarSign,
    color: 'bg-amber-600',
  },
];

const handleAppSelect = (app: AppInfo) => {
  if (app.url) {
    window.location.href = app.url;
  }
};

const handleLogout = () => {
  console.log('Logging out...');
  // Logic logout here
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- Sidebar -->
    <Sidebar>
      <template #header>
        <SidebarHeader 
          title="SSO Admin" 
          subtitle="Management Portal" 
          logo="/logo.png"
        />
        <SidebarAppSwitcher 
          :apps="apps" 
          current-app-name="SSO Admin" 
          @select="handleAppSelect"
        />
      </template>

      <!-- Dashboard -->
      <SidebarGroup>
        <SidebarItem
          :icon="LayoutDashboard"
          title="Overview"
          as="router-link"
          to="/"
          active
        />
      </SidebarGroup>

      <!-- Auth Management -->
      <SidebarGroup label="Identity & Access">
        <SidebarItem 
          :icon="Globe" 
          title="Client Applications" 
          as="router-link"
          to="/clients" 
        />
        <SidebarItem 
          :icon="Users" 
          title="User Management" 
          as="router-link"
          to="/users" 
        />
        <SidebarItem 
          :icon="ShieldCheck" 
          title="Role Permissions" 
          as="router-link"
          to="/roles" 
        />
      </SidebarGroup>

      <!-- Security -->
      <SidebarGroup label="Security">
        <SidebarItem 
          :icon="Lock" 
          title="Session Management" 
          as="router-link"
          to="/sessions" 
        />
        <SidebarItem 
          :icon="Key" 
          title="Audit Logs" 
          as="router-link"
          to="/audit" 
        />
      </SidebarGroup>

      <template #footer>
        <div class="flex flex-col gap-4">
          <SidebarItem 
            :icon="Settings" 
            title="Settings" 
            as="router-link"
            to="/settings"
          />
          <SidebarUserNav
            :user="{ name: 'Bagus Yanuar', role: 'Super Admin' }"
            @logout="handleLogout"
          />
        </div>
      </template>
    </Sidebar>

    <!-- Main Content -->
    <main class="pl-72 transition-all duration-300">
      <div class="p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>
