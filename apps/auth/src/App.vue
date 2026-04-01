<script setup lang="ts">
import { GButton } from '@genrs/ui/components/button';
import { GTextfield } from '@genrs/ui/components/textfield';
</script>

<template>
  <div>
    <GButton text="Button" class="bg-purple-400" />
    <GTextfield />
    <input type="text" placeholder="username" />
  </div>
</template>
