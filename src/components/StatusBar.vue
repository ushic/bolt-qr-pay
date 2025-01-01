<template>
  <div class="flex justify-between items-center mb-8">
    <button class="text-white rounded-full bg-white/10 p-2">
      <component :is="Icons.Help" class="h-6 w-6" />
    </button>
    <div class="flex items-center gap-2">
      <component :is="Icons.Signal" class="h-4 w-4 text-white" />
    </div>
  </div>
</template>

<script setup>
import { Icons } from '@/components/icons'
</script>
