<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '#shadcn/components/ui/card';

interface Props {
  title?: string;
  description?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <Card v-bind="$attrs">
    <CardHeader v-if="$slots.header || title || description">
      <slot name="header">
        <CardTitle v-if="title">{{ title }}</CardTitle>
        <CardDescription v-if="description">{{ description }}</CardDescription>
      </slot>
    </CardHeader>
    
    <CardContent v-if="$slots.default || $slots.content">
      <slot name="content">
        <slot />
      </slot>
    </CardContent>
    
    <CardFooter v-if="$slots.footer">
      <slot name="footer" />
    </CardFooter>
  </Card>
</template>
