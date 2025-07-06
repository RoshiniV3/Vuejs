<template>
  <div class="col-lg-3 col-md-6 col-sm-6 mb-3">
    <div
      class="stats-card"
      :style="{ backgroundColor: backgroundColor || getBootstrapColor(color) }"
    >
      <div class="card-body d-flex align-items-center">
        <i
          :class="icon"
          class="card-icon"
          :style="{ color: iconColor || 'currentColor' }"
        ></i>
        <div class="card-content">
          <h5 class="card-title">{{ title }}</h5>
          <h6 class="card-value">{{ value }}</h6>
          <small class="card-subtitle">{{ subtitle }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string
  subtitle: string
  icon: string
  iconColor?: string
  color?: string
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: '',
  color: '',
  backgroundColor: ''
})

const getBootstrapColor = (color: string): string | null => {
  // Return null if no color is provided
  if (!color) return null

  // Map Bootstrap color names to CSS variables for consistency
  const colorMap: Record<string, string> = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    success: 'var(--color-success)',
    danger: 'var(--color-danger)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
    light: 'var(--color-light)',
    dark: 'var(--color-dark)'
  }
  return colorMap[color] || color
}
</script>

<style scoped>
.stats-card {
  border: none !important;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease;
  background: #ffffff;
  height: 100%;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

.card-body {
  padding: 1.5rem;
}

.card-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
  opacity: 0.8;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--color-black);
}

.card-subtitle {
  font-size: 0.75rem;
  color: var(--color-secondary);
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-icon {
    font-size: 2rem;
    margin-right: 0.75rem;
  }
  
  .card-value {
    font-size: 1.5rem;
  }
  
  .card-body {
    padding: 1.25rem;
  }
}
</style>
