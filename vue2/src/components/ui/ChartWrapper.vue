<template>
  <div class="chart-wrapper-container" :class="wrapperClasses">
    <div class="chart-card" :style="cardStyles">
      <!-- Header Section -->
      <div class="chart-header" v-if="showHeader">
        <div class="header-content">
          <div class="title-section">
            <h6 class="chart-title" v-if="title">{{ title }}</h6>
            <p class="chart-description" v-if="description">{{ description }}</p>
          </div>
          <div class="header-actions" v-if="showActions">
            <slot name="header-actions">
              <button 
                type="button" 
                class="action-btn"
                @click="$emit('refresh')"
                title="Refresh"
              >
                <i class="bi bi-arrow-clockwise"></i>
              </button>
              <button 
                type="button" 
                class="action-btn"
                @click="$emit('expand')"
                title="Expand"
              >
                <i class="bi bi-arrows-fullscreen"></i>
              </button>
            </slot>
          </div>
        </div>
      </div>

      <!-- Chart Content -->
      <div class="chart-content" :style="contentStyles">
        <div class="chart-inner" :class="{ 'loading': isLoading }">
          <!-- Loading Overlay -->
          <div v-if="isLoading" class="loading-overlay">
            <div class="loading-spinner">
              <div class="spinner"></div>
              <span class="loading-text">{{ loadingText }}</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="hasError" class="error-state">
            <i class="bi bi-exclamation-triangle error-icon"></i>
            <p class="error-message">{{ errorMessage }}</p>
            <button class="btn btn-sm btn-outline-primary" @click="$emit('retry')">
              Try Again
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="isEmpty" class="empty-state">
            <i class="bi bi-bar-chart empty-icon"></i>
            <p class="empty-message">{{ emptyMessage }}</p>
          </div>

          <!-- Chart Slot -->
          <div v-else class="chart-slot">
            <slot></slot>
          </div>
        </div>
      </div>

      <!-- Footer Section -->
      <div class="chart-footer" v-if="showFooter || $slots.footer">
        <slot name="footer">
          <div class="footer-content">
            <small class="footer-text">{{ footerText }}</small>
            <div class="footer-meta" v-if="lastUpdated">
              <small class="text-muted">Last updated: {{ formattedLastUpdated }}</small>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartWrapper',
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    footerText: {
      type: String,
      default: ''
    },
    height: {
      type: [String, Number],
      default: 300
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    borderColor: {
      type: String,
      default: 'var(--color-light)'
    },
    borderRadius: {
      type: String,
      default: '8px'
    },
    padding: {
      type: String,
      default: '16px'
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: false
    },
    showActions: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    hasError: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: 'Loading chart data...'
    },
    errorMessage: {
      type: String,
      default: 'Failed to load chart data'
    },
    emptyMessage: {
      type: String,
      default: 'No data available'
    },
    lastUpdated: {
      type: Date,
      default: null
    },
    variant: {
      type: String,
      default: 'default',
      validator: value => ['default', 'minimal', 'bordered', 'elevated'].includes(value)
    }
  },
  computed: {
    wrapperClasses() {
      return [
        `chart-variant-${this.variant}`,
        {
          'chart-loading': this.isLoading,
          'chart-error': this.hasError,
          'chart-empty': this.isEmpty
        }
      ]
    },
    cardStyles() {
      return {
        backgroundColor: this.backgroundColor,
        borderColor: this.borderColor,
        borderRadius: this.borderRadius,
        height: typeof this.height === 'number' ? `${this.height}px` : this.height
      }
    },
    contentStyles() {
      return {
        padding: this.padding
      }
    },
    formattedLastUpdated() {
      if (!this.lastUpdated) return ''
      return this.lastUpdated.toLocaleString()
    }
  }
}
</script>

<style scoped>
.chart-wrapper-container {
  width: 100%;
  height: 100%;
}

.chart-card {
  border: 1px solid var(--color-light);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow: hidden;
  background: #ffffff;
}

/* Variants */
.chart-variant-default .chart-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.chart-variant-default .chart-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.chart-variant-minimal .chart-card {
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chart-variant-minimal .chart-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.chart-variant-bordered .chart-card {
  border: 2px solid var(--color-light);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-variant-bordered .chart-card:hover {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
  border-color: var(--card-blue);
}

.chart-variant-elevated .chart-card {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
  border: none;
}

.chart-variant-elevated .chart-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

/* Header */
.chart-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid var(--color-light);
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.chart-title {
  margin: 0;
  font-weight: 600;
  color: var(--color-black);
  font-size: 14px;
}

.chart-description {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: var(--color-secondary);
}

.header-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  padding: 4px 8px;
  border: 1px solid var(--color-secondary);
  background: transparent;
  color: var(--color-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
}

.action-btn:hover {
  background-color: var(--color-light);
  border-color: var(--color-black);
  color: var(--color-black);
}

/* Content */
.chart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.chart-inner {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-slot {
  width: 100%;
  height: 100%;
}

/* Loading State */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-light);
  border-top: 3px solid var(--card-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 8px;
}

.loading-text {
  font-size: 12px;
  color: var(--color-secondary);
}

/* Error State */
.error-state {
  text-align: center;
  padding: 20px;
}

.error-icon {
  font-size: 32px;
  color: var(--color-red);
  margin-bottom: 8px;
}

.error-message {
  color: var(--color-secondary);
  margin-bottom: 12px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 20px;
}

.empty-icon {
  font-size: 32px;
  color: var(--color-secondary);
  margin-bottom: 8px;
}

.empty-message {
  color: var(--color-secondary);
}

/* Footer */
.chart-footer {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 1px solid var(--color-light);
  padding: 12px 20px;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-text {
  color: var(--color-secondary);
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .header-actions {
    display: none;
  }
  
  .chart-header {
    padding: 10px 12px;
  }
  
  .chart-content {
    padding: 12px;
  }
}
</style>
