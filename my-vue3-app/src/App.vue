<template>
  <div class="app-container">
    <Header @toggle-sidebar="toggleSidebar" />
    <Sidebar v-if="sidebarVisible" />
    <main class="main-content" :class="{ 'with-sidebar': sidebarVisible }">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/layout/Sidebar.vue'
import Header from './components/layout/Header.vue'

const sidebarVisible = ref<boolean>(true)

const toggleSidebar = (): void => {
  sidebarVisible.value = !sidebarVisible.value
}
</script>

<style>
.app-container {
  position: relative;
  min-height: 100vh;
}

.main-content {
  padding: 1rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-top: 80px; /* Header height + padding */
  transition: margin-left 0.3s ease;
}

.main-content.with-sidebar {
  margin-left: 240px; /* Sidebar width */
}

/* Ensure body has no default margins */
body {
  margin: 0;
  padding: 0;
}
</style>
