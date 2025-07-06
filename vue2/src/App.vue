<template>
  <div class="app-container">
    <Header @toggle-sidebar="toggleSidebar" />
    <Sidebar v-if="sidebarVisible" />
    <main class="main-content" :class="{ 'with-sidebar': sidebarVisible }">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from './components/layout/Sidebar.vue'
import Header from './components/layout/Header.vue'

export default {
  name: 'App',
  components: { Sidebar, Header },
  data() {
    return {
      sidebarVisible: true
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    }
  }
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
