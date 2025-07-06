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
        <canvas ref="chartCanvas" :key="chartKey"></canvas>
      </div>
    </div>
    <div class="chart-footer" v-if="showFooter">
      <small class="last-updated">Last updated: {{ lastUpdated }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, toRaw } from 'vue'
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
const chartKey = ref<number>(0)

// Deep clone function to remove Vue reactivity completely
const deepClone = (obj: any): any => {
  try {
    // Use JSON methods for a complete deep clone that removes all Vue reactivity
    return JSON.parse(JSON.stringify(toRaw(obj)))
  } catch (error) {
    console.warn('Failed to JSON clone chart data, falling back to manual clone:', error)
    // Fallback to manual cloning
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => deepClone(item))
    if (typeof obj === 'object') {
      const clonedObj: any = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = deepClone(obj[key])
        }
      }
      return clonedObj
    }
    return obj
  }
}

const createChart = async (): Promise<void> => {
  if (!chartCanvas.value || !props.chartData) {
    console.warn('BaseChart: Cannot create chart - missing canvas or data', {
      hasCanvas: !!chartCanvas.value,
      hasData: !!props.chartData
    })
    return
  }

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }

  await nextTick()

  // Clear the canvas
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, chartCanvas.value.width, chartCanvas.value.height)

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

  // Deep clone to completely remove Vue reactivity from Chart.js data
  const clonedChartData = deepClone(toRaw(props.chartData))
  const clonedChartOptions = deepClone(toRaw(props.chartOptions))

  const mergedOptions = {
    ...defaultOptions,
    ...clonedChartOptions
  }

  chartInstance.value = new Chart(ctx, {
    type: props.chartType,
    data: clonedChartData,
    options: mergedOptions
  })

  console.log(`BaseChart: Successfully created ${props.chartType} chart for "${props.title}"`, {
    datasetCount: clonedChartData?.datasets?.length || 0,
    hasOptions: !!mergedOptions
  })
}

const refreshChart = (): void => {
  lastUpdated.value = new Date().toLocaleTimeString()

  // Properly destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }

  // Force canvas re-creation by updating key
  chartKey.value += 1

  // Small delay for visual feedback and to ensure DOM is ready
  setTimeout(async () => {
    await nextTick()
    await createChart()
    emit('refresh')
  }, 200)
}

const toggleFullscreen = (): void => {
  emit('toggle-fullscreen')
}

watch(() => props.chartData, async () => {
  if (props.chartData) {
    // Force canvas re-creation and recreate chart completely
    chartKey.value += 1
    await nextTick()
    await createChart()
  }
}, { deep: true })

watch(() => props.chartOptions, async () => {
  if (props.chartOptions) {
    // Force canvas re-creation and recreate chart completely when options change
    chartKey.value += 1
    await nextTick()
    await createChart()
  }
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
