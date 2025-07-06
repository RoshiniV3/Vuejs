<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="d-flex justify-content-between align-items-start">
        <div class="chart-title-section">
          <h6 class="chart-title">{{ title }}</h6>
          <small class="chart-subtitle">{{ subtitle }}</small>
        </div>
        <div class="chart-actions" v-if="showActions">
          <button
            type="button"
            class="chart-action-btn"
            @click="refreshChart"
            title="Refresh"
          >
            <i class="bi bi-arrow-clockwise"></i>
          </button>
          <button
            type="button"
            class="chart-action-btn"
            @click="toggleFullscreen"
            title="Fullscreen"
          >
            <i class="bi bi-arrows-fullscreen"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="chart-body">
      <div class="chart-container" :style="{ height: height + 'px' }">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
    <div class="chart-footer" v-if="showFooter">
      <small class="last-updated">Last updated: {{ lastUpdated }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  PieController
} from 'chart.js'

// Register Chart.js components and controllers
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  PieController
)

interface Props {
  title: string
  subtitle?: string
  chartType: 'line' | 'bar' | 'pie'
  chartData: any
  chartOptions?: any
  height?: number
  showActions?: boolean
  showFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  chartOptions: () => ({}),
  height: 300,
  showActions: false,
  showFooter: false
})

const emit = defineEmits<{
  refresh: []
  'toggle-fullscreen': []
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart | null>(null)
const lastUpdated = ref<string>(new Date().toLocaleTimeString())

const createChart = async (): Promise<void> => {
  if (!chartCanvas.value || !props.chartData) return

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  await nextTick()

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false
      }
    },
    scales: props.chartType !== 'pie' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: 'var(--chart-grid-color)'
        }
      },
      x: {
        grid: {
          color: 'var(--chart-grid-color)'
        }
      }
    } : undefined
  }

  const mergedOptions = {
    ...defaultOptions,
    ...props.chartOptions
  }

  chartInstance.value = new Chart(ctx, {
    type: props.chartType,
    data: props.chartData,
    options: mergedOptions
  })
}

const refreshChart = (): void => {
  lastUpdated.value = new Date().toLocaleTimeString()

  // Add refresh animation
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  // Small delay for visual feedback
  setTimeout(() => {
    createChart()
    emit('refresh')
  }, 200)
}

const toggleFullscreen = (): void => {
  const chartCard = chartCanvas.value?.closest('.chart-card') as HTMLElement
  if (!chartCard) return

  if (!document.fullscreenElement) {
    // Enter fullscreen
    chartCard.requestFullscreen().then(() => {
      chartCard.classList.add('fullscreen-mode')
      // Resize chart after entering fullscreen
      setTimeout(() => {
        if (chartInstance.value) {
          chartInstance.value.resize()
        }
      }, 100)
    }).catch(err => {
      console.error('Error entering fullscreen:', err)
    })
  } else {
    // Exit fullscreen
    document.exitFullscreen().then(() => {
      chartCard.classList.remove('fullscreen-mode')
      // Resize chart after exiting fullscreen
      setTimeout(() => {
        if (chartInstance.value) {
          chartInstance.value.resize()
        }
      }, 100)
    }).catch(err => {
      console.error('Error exiting fullscreen:', err)
    })
  }

  emit('toggle-fullscreen')
}

watch(() => props.chartData, () => {
  if (chartInstance.value && props.chartData) {
    chartInstance.value.data = props.chartData
    chartInstance.value.update()
  }
}, { deep: true })

watch(() => props.chartOptions, () => {
  createChart()
}, { deep: true })

onMounted(() => {
  createChart()
})

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
})
</script>

<style scoped>
.chart-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  height: 100%;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.chart-header {
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid #f1f3f4;
}

.chart-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
}

.chart-subtitle {
  color: #6c757d;
  font-size: 0.8rem;
  line-height: 1.3;
}

.chart-actions {
  display: flex;
  gap: 0.25rem;
}

.chart-action-btn {
  background: none;
  border: 1px solid #dee2e6;
  color: #6c757d;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.chart-action-btn:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
}

.chart-body {
  padding: 0.75rem 1.25rem 1rem;
}

.chart-container {
  position: relative;
  width: 100%;
}

.chart-footer {
  padding: 0.5rem 1.25rem 0.75rem;
  border-top: 1px solid #f1f3f4;
  background-color: #fafbfc;
}

.last-updated {
  color: #6c757d;
  font-size: 0.75rem;
}

/* Fullscreen mode styles */
.chart-card.fullscreen-mode {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999 !important;
  border-radius: 0 !important;
  max-width: none !important;
  max-height: none !important;
}

.chart-card.fullscreen-mode .chart-body {
  padding: 2rem;
}

.chart-card.fullscreen-mode .chart-container {
  height: calc(100vh - 200px) !important;
}

.chart-card.fullscreen-mode .chart-title {
  font-size: 1.25rem;
}

.chart-card.fullscreen-mode .chart-subtitle {
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chart-actions {
    gap: 0.125rem;
  }

  .chart-action-btn {
    width: 24px;
    height: 24px;
    font-size: 0.7rem;
  }
}
</style>
