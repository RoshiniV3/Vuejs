<template>
  <nav class="navbar navbar-dark custom-navbar">
    <div class="container-fluid d-flex align-items-center">
      <!-- Left section: Toggle button and brand -->
      <div class="d-flex align-items-center">
        <button
          class="navbar-toggler sidebar-toggle me-2"
          type="button"
          @click="toggleSidebar"
          aria-label="Toggle sidebar"
        >
          <i class="bi bi-list"></i>
        </button>

        <div class="d-flex align-items-center">
          <span class="navbar-brand mb-0 fw-semibold">Vue Admin Template</span>
        </div>
      </div>

      <!-- Center section: Search -->
      <div class="flex-grow-1 d-flex justify-content-center mx-3">
        <div class="search-container">
          <input
            class="form-control search-input"
            type="search"
            placeholder="Search"
            v-model="searchQuery"
          />
          <i class="bi bi-search search-icon"></i>
        </div>
      </div>

      <!-- Right section: User actions -->
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-bell text-white cursor-pointer header-icon" title="Notifications"></i>
        <i class="bi bi-github text-white cursor-pointer header-icon" title="GitHub"></i>
        <img
          src="https://i.pravatar.cc/3"
          alt="avatar"
          class="rounded-circle border cursor-pointer"
          width="28"
          height="28"
          title="User Profile"
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref<string>('')

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const toggleSidebar = (): void => {
  emit('toggle-sidebar')
}
</script>

<style scoped>
.custom-navbar {
  background-color: var(--color-black) !important;
  padding: 0.5rem 1rem;
  height: 50px;
  min-height: 50px;
}

.sidebar-toggle {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.sidebar-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.sidebar-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}

.navbar-brand {
  color: white !important;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0;
}

.search-container {
  position: relative;
  max-width: 400px;
  width: 100%;
}

.search-input {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.375rem 40px 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  height: 32px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.search-input:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: var(--card-blue);
  box-shadow: 0 0 0 0.2rem rgba(8, 102, 198, 0.25);
  color: white;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.8;
}

.header-icon {
  font-size: 1.1rem;
}

.text-success {
  color: var(--color-green) !important;
}

/* Fixed header positioning */
.navbar {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1030 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .search-container {
    max-width: 200px;
  }

  .navbar-brand {
    font-size: 1rem;
  }
}
</style>
