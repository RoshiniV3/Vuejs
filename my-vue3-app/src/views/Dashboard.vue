<template>
  <div class="dashboard">
    <div class="container-fluid">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="page-title">Dashboard</h2>

            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards Row -->
      <div class="row dashboard-section">
        <BaseCard
          title="Total Tasks"
          :value="stats.totalTasks.toString()"
          subtitle="Active projects"
          icon="bi bi-people"
          backgroundColor="#ffffff"
          iconColor="var(--card-teal)"
        />
        <BaseCard
          title="Completed Tasks"
          :value="stats.completedTasks.toString()"
          subtitle="This week"
          icon="bi bi-check-circle"
          backgroundColor="#ffffff"
          iconColor="var(--color-green)"
        />
        <BaseCard
          title="Pending Tasks"
          :value="stats.pendingTasks.toString()"
          subtitle="Awaiting review"
          icon="bi bi-clock"
          backgroundColor="#ffffff"
          iconColor="var(--color-warning)"
        />
        <BaseCard
          title="Upcoming Tasks"
          :value="stats.upcomingTasks.toString()"
          subtitle="Next 7 days"
          icon="bi bi-calendar-plus"
          backgroundColor="#ffffff"
          iconColor="var(--card-blue)"
        />
      </div>

      <!-- Charts Row -->
      <div class="row charts-row dashboard-section">
        <div class="col-lg-4 col-md-6 mb-4">
          <BaseChart
            title="Site Views"
            subtitle="Daily website traffic overview"
            chart-type="line"
            :chart-data="lineData"
            :chart-options="lineChartOptions"
            :height="280"
            :show-actions="true"
            :show-footer="true"
            @refresh="refreshLineChart"
            @toggle-fullscreen="toggleFullscreen('line')"
          />
        </div>
        <div class="col-lg-4 col-md-6 mb-4">
          <BaseChart
            title="Earnings Overview"
            subtitle="Revenue trends over time"
            chart-type="bar"
            :chart-data="earningsData"
            :chart-options="earningsChartOptions"
            :height="280"
            :show-actions="true"
            :show-footer="true"
            @refresh="refreshEarningsChart"
            @toggle-fullscreen="toggleFullscreen('earnings')"
          />
        </div>
        <div class="col-lg-4 col-md-12 mb-4">
          <BaseChart
            title="Visitors by Country"
            subtitle="Geographic distribution"
            chart-type="pie"
            :chart-data="pieData"
            :chart-options="pieChartOptions"
            :height="280"
            :show-actions="true"
            :show-footer="true"
            @refresh="refreshPieChart"
            @toggle-fullscreen="toggleFullscreen('pie')"
          />
        </div>
      </div>

      <!-- Forms Row -->
      <div class="row forms-row dashboard-section">
        <div class="col-md-6 mb-4 d-flex">
          <UserDetailsForm />
        </div>
        <div class="col-md-6 mb-4 d-flex">
          <UserDirectory />
        </div>
      </div>

      <!-- Fullscreen Chart Modal -->
      <div
        v-if="fullscreenChart"
        class="fullscreen-modal"
        @click="closeFullscreen"
      >
        <div class="fullscreen-content" @click.stop>
          <div class="fullscreen-header">
            <h4 class="fullscreen-title">{{ fullscreenChartTitle }}</h4>
            <button
              type="button"
              class="btn-close-fullscreen"
              @click="closeFullscreen"
              title="Close Fullscreen"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="fullscreen-chart-container" ref="fullscreenContainer">
            <!-- Scroll indicator -->
            <div class="scroll-indicator" v-if="showScrollIndicator">
              <i class="bi bi-chevron-down"></i>
              <span>Scroll for more content</span>
            </div>

            <BaseChart
              v-if="fullscreenChart"
              :title="fullscreenChartTitle"
              :subtitle="fullscreenChartSubtitle"
              :chart-type="fullscreenChart"
              :chart-data="fullscreenChartData"
              :chart-options="fullscreenChartOptions"
              :height="600"
              :show-actions="false"
              :show-footer="false"
            />

            <!-- Additional content area for scrolling demonstration -->
            <div class="fullscreen-additional-content">
              <div class="content-section">
                <h6 class="section-title">Chart Details</h6>
                <p class="section-text">
                  This chart displays comprehensive data visualization in fullscreen mode.
                  You can scroll through this content to view additional information and insights.
                </p>
              </div>

              <div class="content-section">
                <h6 class="section-title">Data Insights</h6>
                <ul class="insights-list">
                  <li>Peak performance periods identified</li>
                  <li>Trend analysis shows positive growth</li>
                  <li>Seasonal patterns detected in the data</li>
                  <li>Recommendations for optimization available</li>
                </ul>
              </div>

              <div class="content-section">
                <h6 class="section-title">Export Options</h6>
                <div class="export-buttons">
                  <button
                    class="btn btn-outline-primary btn-sm me-2"
                    @click="exportChartAsPNG"
                    :disabled="exportLoading.png"
                    type="button"
                  >
                    <i class="bi bi-download" v-if="!exportLoading.png"></i>
                    <div class="spinner-border spinner-border-sm" role="status" v-if="exportLoading.png">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    {{ exportLoading.png ? 'Exporting...' : 'Export PNG' }}
                  </button>
                  <button
                    class="btn btn-outline-secondary btn-sm me-2"
                    @click="exportChartAsPDF"
                    :disabled="exportLoading.pdf"
                    type="button"
                  >
                    <i class="bi bi-file-earmark-pdf" v-if="!exportLoading.pdf"></i>
                    <div class="spinner-border spinner-border-sm" role="status" v-if="exportLoading.pdf">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    {{ exportLoading.pdf ? 'Exporting...' : 'Export PDF' }}
                  </button>
                  <button
                    class="btn btn-outline-success btn-sm"
                    @click="exportChartAsExcel"
                    :disabled="exportLoading.excel"
                    type="button"
                  >
                    <i class="bi bi-file-earmark-excel" v-if="!exportLoading.excel"></i>
                    <div class="spinner-border spinner-border-sm" role="status" v-if="exportLoading.excel">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    {{ exportLoading.excel ? 'Exporting...' : 'Export Excel' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import UserDetailsForm from '@/components/ui/UserDetailsForm.vue'
import UserDirectory from '@/components/ui/UserDirectory.vue'

// Import export libraries
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// Stats data
const stats = reactive({
  totalTasks: 19,
  completedTasks: 7,
  pendingTasks: 12,
  upcomingTasks: 5
})

// Fullscreen modal state
const fullscreenChart = ref<string | null>(null)
const fullscreenChartTitle = ref<string>('')
const fullscreenChartSubtitle = ref<string>('')
const fullscreenChartData = ref<any>(null)
const fullscreenChartOptions = ref<any>(null)
const showScrollIndicator = ref<boolean>(false)
const fullscreenContainer = ref<HTMLElement | null>(null)

// Export state
const exportLoading = reactive({
  png: false,
  pdf: false,
  excel: false
})

// Chart data
const lineData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Site Views',
      data: [5, 10, 15, 18, 12, 8],
      borderColor: '#0866c6',
      backgroundColor: 'rgba(8, 102, 198, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#0866c6',
      pointBorderColor: '#0866c6',
      pointRadius: 4
    }
  ]
})

const earningsData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Earnings',
      data: [1500, 2800, 1800, 4500, 5000, 2800],
      backgroundColor: '#20c997',
      borderColor: '#20c997',
      borderWidth: 1
    }
  ]
})

const pieData = reactive({
  labels: ['USA', 'Canada', 'UK', 'Germany', 'France'],
  datasets: [
    {
      data: [45, 20, 15, 12, 8],
      backgroundColor: [
        '#0866c6',
        '#20c997',
        '#dc3545',
        '#ffc107',
        '#6c757d'
      ],
      borderWidth: 0
    }
  ]
})

// Chart options
const lineChartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#f1f3f4',
        drawBorder: false
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#6c757d'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#6c757d'
      }
    }
  }
})

const earningsChartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#f1f3f4',
        drawBorder: false
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#6c757d'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#6c757d'
      }
    }
  }
})

const pieChartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12
        }
      }
    }
  }
})

// Methods
const refreshLineChart = (): void => {
  // Generate new realistic data for line chart
  const newData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 2)
  lineData.datasets[0].data = newData
}

const refreshEarningsChart = (): void => {
  // Generate new realistic data for earnings chart
  const newData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 4000) + 1000)
  earningsData.datasets[0].data = newData
}

const refreshPieChart = (): void => {
  // Generate new realistic data for pie chart
  const total = 100
  const usa = Math.floor(Math.random() * 40) + 30
  const canada = Math.floor(Math.random() * 20) + 10
  const uk = Math.floor(Math.random() * 15) + 5
  const germany = Math.floor(Math.random() * 15) + 5
  const france = Math.max(0, total - usa - canada - uk - germany)

  pieData.datasets[0].data = [usa, canada, uk, germany, france]
}

const toggleFullscreen = (chartType: string): void => {
  console.log(`Toggle fullscreen for ${chartType} chart`)

  switch (chartType) {
    case 'line':
      fullscreenChart.value = 'line'
      fullscreenChartTitle.value = 'Site Views - Fullscreen'
      fullscreenChartSubtitle.value = 'Daily website traffic overview'
      fullscreenChartData.value = lineData
      fullscreenChartOptions.value = lineChartOptions
      break
    case 'pie':
      fullscreenChart.value = 'pie'
      fullscreenChartTitle.value = 'Visitors by Country - Fullscreen'
      fullscreenChartSubtitle.value = 'Geographic distribution of users'
      fullscreenChartData.value = pieData
      fullscreenChartOptions.value = pieChartOptions
      break
    case 'earnings':
      fullscreenChart.value = 'bar'
      fullscreenChartTitle.value = 'Earnings Overview - Fullscreen'
      fullscreenChartSubtitle.value = 'Revenue trends over time'
      fullscreenChartData.value = earningsData
      fullscreenChartOptions.value = earningsChartOptions
      break
  }

  // Show scroll indicator after modal opens
  setTimeout(() => {
    checkScrollIndicator()
  }, 100)
}

const closeFullscreen = (): void => {
  fullscreenChart.value = null
  fullscreenChartTitle.value = ''
  fullscreenChartSubtitle.value = ''
  fullscreenChartData.value = null
  fullscreenChartOptions.value = null
  showScrollIndicator.value = false
}

const checkScrollIndicator = (): void => {
  if (fullscreenContainer.value) {
    const { scrollHeight, clientHeight } = fullscreenContainer.value
    showScrollIndicator.value = scrollHeight > clientHeight
  }
}

const exportToPDF = async (): Promise<void> => {
  try {
    const element = document.querySelector('.dashboard') as HTMLElement
    if (!element) return

    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF()
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save('dashboard.pdf')
  } catch (error) {
    console.error('Error exporting to PDF:', error)
  }
}

const exportToExcel = (): void => {
  try {
    const data = [
      ['Metric', 'Value'],
      ['Total Users', '1,234'],
      ['Revenue', '$12,345'],
      ['Orders', '567'],
      ['Growth', '23%']
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Dashboard')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, 'dashboard.xlsx')
  } catch (error) {
    console.error('Error exporting to Excel:', error)
  }
}

// Export methods for fullscreen charts
const exportChartAsPNG = async (): Promise<void> => {
  console.log('PNG Export clicked!')
  try {
    exportLoading.png = true

    // Find the chart container in fullscreen modal
    const chartContainer = fullscreenContainer.value
    if (!chartContainer) {
      throw new Error('Chart container not found')
    }

    // Use html2canvas to capture the chart
    const canvas = await html2canvas(chartContainer, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true
    })

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const fileName = `${fullscreenChartTitle.value.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.png`
        saveAs(blob, fileName)
        console.log('Chart exported as PNG successfully!')
      }
    }, 'image/png')

  } catch (error) {
    console.error('Error exporting PNG:', error)
  } finally {
    exportLoading.png = false
  }
}

const exportChartAsPDF = async (): Promise<void> => {
  console.log('PDF Export clicked!')
  try {
    exportLoading.pdf = true

    // Find the chart container in fullscreen modal
    const chartContainer = fullscreenContainer.value
    if (!chartContainer) {
      throw new Error('Chart container not found')
    }

    // Use html2canvas to capture the chart
    const canvas = await html2canvas(chartContainer, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true
    })

    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    // Calculate dimensions to fit the image properly
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = (pdfHeight - imgHeight * ratio) / 2

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

    // Save PDF
    const fileName = `${fullscreenChartTitle.value.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
    console.log('Chart exported as PDF successfully!')

  } catch (error) {
    console.error('Error exporting PDF:', error)
  } finally {
    exportLoading.pdf = false
  }
}

const exportChartAsExcel = async (): Promise<void> => {
  console.log('Excel Export clicked!')
  try {
    exportLoading.excel = true

    // Get the current chart data
    let data: any[][] = []
    let headers: string[] = []

    if (fullscreenChartData.value) {
      const chartData = fullscreenChartData.value
      if (chartData.labels && chartData.datasets) {
        headers = ['Label', ...chartData.datasets.map((dataset: any) => dataset.label || 'Data')]

        chartData.labels.forEach((label: string, index: number) => {
          const row = [label]
          chartData.datasets.forEach((dataset: any) => {
            row.push(dataset.data[index] || 0)
          })
          data.push(row)
        })
      }
    }

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const wsData = [headers, ...data]
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Chart Data')

    // Generate Excel file
    const fileName = `${fullscreenChartTitle.value.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
    console.log('Chart data exported as Excel successfully!')

  } catch (error) {
    console.error('Error exporting Excel:', error)
  } finally {
    exportLoading.excel = false
  }
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.page-title {
  color: var(--color-black);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.dashboard-section {
  margin-bottom: 2rem;
}

.forms-row {
  align-items: stretch;
}

.forms-row .col-md-6 {
  display: flex;
}

.forms-row .col-md-6 > * {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Fullscreen Modal Styles */
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  animation: fadeIn 0.3s ease-out;
  scroll-behavior: smooth;
}

.fullscreen-content {
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  min-height: calc(100vh - 40px);
  max-width: 1200px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  margin: auto;
  position: relative;
  animation: slideIn 0.3s ease-out;
}

.fullscreen-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.fullscreen-title {
  margin: 0;
  font-weight: 600;
  color: var(--color-black);
  font-size: 18px;
}

.btn-close-fullscreen {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--color-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close-fullscreen:hover {
  background-color: var(--color-light);
  color: var(--color-black);
}

.fullscreen-chart-container {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-height: 0;
  max-height: calc(100vh - 140px);
  position: relative;
  scroll-behavior: smooth;
}

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 20;
  animation: fadeInOut 3s ease-in-out;
  pointer-events: none;
}

.scroll-indicator i {
  animation: bounce 1.5s infinite;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
  20% { opacity: 1; transform: translateX(-50%) translateY(0); }
  80% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-4px); }
  60% { transform: translateY(-2px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Custom scrollbar for webkit browsers */
.fullscreen-chart-container::-webkit-scrollbar {
  width: 8px;
}

.fullscreen-chart-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.fullscreen-chart-container::-webkit-scrollbar-thumb {
  background: var(--color-secondary);
  border-radius: 4px;
}

.fullscreen-chart-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-black);
}

/* Additional content styles */
.fullscreen-additional-content {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--color-light);
}

.content-section {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid var(--card-blue);
}

.section-title {
  margin: 0 0 12px 0;
  font-weight: 600;
  color: var(--color-black);
  font-size: 14px;
}

.section-text {
  margin: 0;
  color: var(--color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.insights-list {
  margin: 0;
  padding-left: 20px;
  color: var(--color-secondary);
  font-size: 13px;
}

.insights-list li {
  margin-bottom: 6px;
}

.export-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.export-buttons .btn {
  font-size: 12px;
  padding: 6px 12px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.export-buttons .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.export-buttons .btn .spinner-border-sm {
  width: 14px;
  height: 14px;
  border-width: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .d-flex.gap-2 {
    flex-direction: column;
    gap: 0.5rem !important;
  }

  .btn {
    font-size: 0.875rem;
  }

  .fullscreen-modal {
    padding: 10px;
    align-items: flex-start;
  }

  .fullscreen-content {
    width: 100%;
    min-height: calc(100vh - 20px);
    border-radius: 8px;
  }

  .fullscreen-header {
    padding: 16px;
  }

  .fullscreen-title {
    font-size: 16px;
  }

  .fullscreen-chart-container {
    padding: 16px;
    max-height: calc(100vh - 100px);
    -webkit-overflow-scrolling: touch;
  }

  .fullscreen-additional-content {
    margin-top: 16px;
    padding-top: 16px;
  }

  .content-section {
    margin-bottom: 16px;
    padding: 12px;
  }

  .export-buttons {
    flex-direction: column;
  }

  .export-buttons .btn {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>
