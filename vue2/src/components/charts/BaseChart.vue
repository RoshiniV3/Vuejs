<template>
  <div class="chart-wrapper">
    <div class="card chart-card">
      <div class="card-header" v-if="title || showHeader">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="card-title mb-0">{{ title || 'Chart' }}</h6>
          <div class="chart-actions" v-if="showActions">
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary chart-action-btn"
              @click="refreshChart"
              title="Refresh Chart"
            >
              <i class="bi bi-arrow-clockwise"></i>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary chart-action-btn ms-1"
              @click="toggleFullscreen"
              title="Toggle Fullscreen"
            >
              <i class="bi bi-arrows-fullscreen"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body chart-body" :style="{ height: chartHeight }">
        <div class="chart-container" :class="{ 'chart-loading': isLoading }">
          <div v-if="isLoading" class="chart-loading-overlay">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <component
            v-else
            :is="chartComponent"
            :chart-data="chartData"
            :chart-options="mergedChartOptions"
            :height="height"
            :width="width"
            :key="chartKey"
            ref="chart"
          />
        </div>
      </div>
      <div class="card-footer" v-if="subtitle || showFooter">
        <small class="text-muted">{{ subtitle }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import { Line, Bar, Pie, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins

const BaseLine = {
  extends: Line,
  mixins: [reactiveProp],
  props: ['chartData', 'chartOptions'],
  mounted() {
    this.renderChart(this.chartData, this.chartOptions)
  }
}

const BasePie = {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['chartData', 'chartOptions'],
  mounted() {
    this.renderChart(this.chartData, this.chartOptions)
  }
}

const BaseBar = {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['chartData', 'chartOptions'],
  mounted() {
    this.renderChart(this.chartData, this.chartOptions)
  }
}

export default {
  name: 'BaseChart',
  data() {
    return {
      chartKey: 0
    }
  },
  props: {
    chartType: {
      type: String,
      default: 'line'
    },
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 300
    },
    width: Number,
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
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    borderColor: {
      type: String,
      default: 'var(--color-light)'
    }
  },
  watch: {
    chartData: {
      handler() {
        this.$nextTick(() => {
          this.refreshChartComponent();
        });
      },
      deep: true
    }
  },
  computed: {
    chartComponent() {
      switch (this.chartType) {
        case 'pie':
          return BasePie
        case 'bar':
          return BaseBar
        case 'line':
        default:
          return BaseLine
      }
    },
    chartHeight() {
      return `${this.height}px`
    },
    mergedChartOptions() {
      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          }
        },
        scales: this.chartType !== 'pie' ? {
          x: {
            grid: {
              color: 'var(--chart-grid-color)',
              borderColor: 'var(--color-light)'
            },
            ticks: {
              font: {
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: 'var(--chart-grid-color)',
              borderColor: 'var(--color-light)'
            },
            ticks: {
              font: {
                size: 11
              }
            }
          }
        } : undefined
      }

      return { ...defaultOptions, ...this.chartOptions }
    }
  },
  methods: {
    refreshChart() {
      this.$emit('refresh')
      // Force complete re-render by changing the key
      this.refreshChartComponent();
    },

    refreshChartComponent() {
      // Increment the key to force Vue to completely re-render the component
      this.chartKey += 1;
    },

    toggleFullscreen() {
      this.$emit('toggle-fullscreen')
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
  height: 100%;
}

.chart-card {
  border: 1px solid var(--color-light);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.chart-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid var(--color-light);
  padding: 16px 20px;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-weight: 600;
  color: var(--color-black);
  font-size: 14px;
}

.chart-actions {
  display: flex;
  align-items: center;
}

.chart-action-btn {
  padding: 4px 8px;
  border: 1px solid var(--color-secondary);
  background-color: transparent;
  color: var(--color-secondary);
  font-size: 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.chart-action-btn:hover {
  background-color: var(--color-light);
  border-color: var(--color-black);
  color: var(--color-black);
}

.chart-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  position: relative;
}

.chart-container {
  position: relative;
  flex: 1;
  min-height: 200px;
}

.chart-loading {
  opacity: 0.6;
}

.chart-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.card-footer {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 1px solid var(--color-light);
  padding: 12px 20px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chart-actions {
    display: none;
  }

  .chart-body {
    padding: 12px;
  }

  .card-header {
    padding: 10px 12px;
  }
}

/* Chart-specific styling */
.chart-container canvas {
  border-radius: 4px;
}

/* Loading animation */
.spinner-border {
  width: 2rem;
  height: 2rem;
}
</style>
