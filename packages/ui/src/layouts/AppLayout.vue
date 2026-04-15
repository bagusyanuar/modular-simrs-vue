<script setup lang="ts">
import {
  NSidebar,
  NSidebarGroup,
  NSidebarItem,
  NSidebarMenuSub,
  NSidebarMenuSubContent,
  NSidebarMenuSubTrigger,
} from '../components/ui/sidebar';
import brandLogo from '../assets/brand-logo.png';
</script>

<template>
  <main class="w-full h-dvh bg-stone-100">
    <NSidebar>
      <div class="w-full flex items-center px-4 py-3 gap-3">
        <img :src="brandLogo" class="w-12 h-12" alt="Brand Logo" />
        <div class="flex flex-col">
          <span class="text-neutral-700 text-lg font-bold">Neurovi</span>
          <span class="text-xs text-neutral-500 font-light leading-none">
            Old Version App
          </span>
        </div>
      </div>
      <NSidebarGroup label="Menu">
        <NSidebarItem icon="lucide:layout-dashboard">Dashboard</NSidebarItem>
        <NSidebarMenuSub>
          <NSidebarMenuSubTrigger icon="lucide:folder-archive"
            >Master Data</NSidebarMenuSubTrigger
          >
          <NSidebarMenuSubContent>
            <NSidebarItem icon="lucide:hospital" href="/v2/unit"
              >Unit</NSidebarItem
            >
            <NSidebarItem icon="lucide:user-cog" to="/staff"
              >Staff</NSidebarItem
            >
          </NSidebarMenuSubContent>
        </NSidebarMenuSub>
      </NSidebarGroup>
    </NSidebar>
    <section class="content ps-64 py-4">
      <div class="px-4">
        <RouterView />
      </div>
    </section>
  </main>
</template>
