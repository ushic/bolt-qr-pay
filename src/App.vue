<template>
  <div class="min-h-screen bg-[#1a2847]" dir="rtl">
    <router-view />
    <Navigation />
  </div>
</template>

<script setup>
import Navigation from './components/Navigation.vue'
</script>
