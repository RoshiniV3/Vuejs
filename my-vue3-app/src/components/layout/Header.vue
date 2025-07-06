<template>
  <nav class="navbar navbar-dark custom-navbar">
    <div class="container-fluid d-flex align-items-center">
      <!-- Left section: Toggle button and brand -->
      <div class="d-flex align-items-center">
        <button
          class="navbar-toggler sidebar-toggle me-3"
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
      <div class="flex-grow-1 d-flex justify-content-center mx-4">
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
      <div class="d-flex align-items-center gap-3">
        <i class="bi bi-bell text-white fs-5 cursor-pointer" title="Notifications"></i>
        <i class="bi bi-github text-white fs-5 cursor-pointer" title="GitHub"></i>
        <img
          src="https://i.pravatar.cc/36"
          alt="avatar"
          class="rounded-circle border cursor-pointer"
          width="32"
          height="32"
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
  padding: 0.75rem 1rem;
  height: 60px;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s;
}

.sidebar-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-brand {
  color: white !important;
  font-size: 1.25rem;
}

.search-container {
  position: relative;
  max-width: 300px;
  width: 100%;
}

.search-input {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding-right: 40px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
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
