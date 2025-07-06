<template>
  <div class="col-md-3">
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

<script>
export default {
  name: 'BaseCard',
  props: {
    title: String,
    value: String,
    subtitle: String,
    icon: String,
    iconColor: {
      type: String,
      required: false,
      default: null
    },
    color: {
      type: String,
      required: false,
      default: null
    },
    backgroundColor: {
      type: String,
      required: false,
      default: null
    }
  },
  methods: {
    getBootstrapColor(color) {
      // Return null if no color is provided
      if (!color) return null;

      // Map Bootstrap color names to CSS variables for consistency
      const colorMap = {
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
  }
}
</script>

<style scoped>
.stats-card {
  border: none !important;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  background: #ffffff;
}

.stats-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-2px);
}

.stats-card .card-body {
  padding: 20px;
}

.stats-card .card-icon {
  font-size: 2.5rem;
  margin-right: 16px;
  opacity: 0.8;
}

.stats-card .card-content {
  flex: 1;
}

.stats-card .card-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stats-card .card-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 4px;
  line-height: 1;
}

.stats-card .card-subtitle {
  font-size: 12px;
  color: var(--color-secondary);
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stats-card .card-icon {
    font-size: 2rem;
    margin-right: 12px;
  }

  .stats-card .card-value {
    font-size: 24px;
  }

  .stats-card .card-body {
    padding: 16px;
  }
}
</style>
