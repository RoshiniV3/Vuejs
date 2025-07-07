<template>
  <div class="sidebar-container d-flex flex-column" style="width: 240px; min-height: 100vh;">
    <!-- Header section with matching navbar background -->
    <div class="sidebar-header p-3 ps-4">
      <h4 class="text-white mb-0"> Panel</h4>
    </div>
    
    <!-- Navigation section with white background -->
    <div class="sidebar-nav bg-white flex-grow-1 p-3">
      <ul class="nav nav-pills flex-column">
        <li class="nav-item" v-for="item in menu" :key="item.name">
          <router-link
            class="nav-link text-dark d-flex align-items-center custom-nav-link"
            active-class="active"
            exact
            :to="item.path"
          >
            <i :class="item.icon" class="me-2"></i> {{ item.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface MenuItem {
  name: string
  path: string
  icon: string
}

const menu = ref<MenuItem[]>([
  { name: 'Dashboard', path: '/', icon: 'bi bi-speedometer2' },
  { name: 'Calendar', path: '/calendar', icon: 'bi bi-calendar3' },
  { name: 'Mailbox', path: '/mailbox', icon: 'bi bi-envelope' }
])
</script>

<style scoped>
.sidebar-header {
  background-color: var(--color-black);
}

.custom-nav-link {
  font-size: 0.95rem;
  padding: 0.6rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.3s;
  background-color: white;
  color: black !important;
  margin-bottom: 0.25rem;
}

.custom-nav-link:hover {
  background-color: var(--color-light);
  color: black !important;
}

.custom-nav-link.active {
  background-color: var(--color-black) !important;
  color: white !important;
}

.sidebar-container {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  bottom: 0 !important;
  z-index: 1020 !important;
  overflow-y: auto !important;
  padding-top: 60px !important;
}

.sidebar-header {
  display: none !important;
}

.sidebar-nav {
  padding-top: 1rem !important;
}
</style>
