<script setup lang="ts">
import {
  NSidebar,
  NSidebarGroup,
  NSidebarItem,
  NSidebarMenuSub,
  NSidebarMenuSubContent,
  NSidebarMenuSubTrigger,
} from '@genrs/ui/components/ui/sidebar';
import brandLogo from '../../assets/logo-rs.png';
import { useActiveMenu } from '@genrs/ui/composables';

const { isActive } = useActiveMenu();
</script>

<template>
  <main class="w-full h-dvh bg-stone-100">
    <NSidebar>
      <div class="w-full flex items-center px-4 py-3 gap-3">
        <img :src="brandLogo" class="w-12 h-12" alt="Brand Logo" />
        <div class="flex flex-col">
          <span class="text-neutral-700 text-base font-bold">Neurovi V1</span>
          <span class="text-xs text-neutral-500 font-light leading-none">
            Old Version App
          </span>
        </div>
      </div>
      <NSidebarGroup label="Menu">
        <NSidebarItem
          icon="lucide:layout-dashboard"
          to="/dashboard"
          :active="isActive('/dashboard')"
        >
          Dashboard
        </NSidebarItem>
        <NSidebarMenuSub>
          <NSidebarMenuSubTrigger icon="lucide:folder-archive">
            Master Data
          </NSidebarMenuSubTrigger>
          <NSidebarMenuSubContent>
            <NSidebarItem
              to="/installation"
              :active="isActive('/installation')"
            >
              Instalasi
            </NSidebarItem>
            <NSidebarItem href="/v2/unit" :active="isActive('/v2/unit')">
              Unit
            </NSidebarItem>
            <NSidebarItem to="/staff" :active="isActive('/staff')">
              Staff
            </NSidebarItem>
            <NSidebarItem to="/specialty" :active="isActive('/specialty')">
              Spesialisasi
            </NSidebarItem>
          </NSidebarMenuSubContent>
        </NSidebarMenuSub>
        <NSidebarMenuSub>
          <NSidebarMenuSubTrigger icon="lucide:hand-heart">
            Pelayanan
          </NSidebarMenuSubTrigger>
          <NSidebarMenuSubContent>
            <NSidebarItem href="/v2/unit" :active="isActive('/v2/outpatient')">
              Rawat Jalan
            </NSidebarItem>
            <NSidebarItem to="/inpatient" :active="isActive('/inpatient')">
              Rawat Inap
            </NSidebarItem>
          </NSidebarMenuSubContent>
        </NSidebarMenuSub>
        <NSidebarItem
          icon="lucide:wallet"
          :href="'/v2/billing'"
          :active="isActive('/v2/billing')"
        >
          Kendali Biaya
        </NSidebarItem>
      </NSidebarGroup>
    </NSidebar>
    <section class="content ps-64 py-4">
      <div class="px-4">
        <RouterView />
      </div>
    </section>
  </main>
</template>
