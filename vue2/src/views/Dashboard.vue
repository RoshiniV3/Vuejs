<template>
  <div>
    <h2 class="mb-4">Dashboard</h2>

    <div class="row">
      <BaseCard
        backgroundColor="#ffffff"
        icon="bi bi-people"
        iconColor="var(--card-teal)"
        title="Total Tasks"
        :value="stats.totalTasks.toString()"
        subtitle="Active projects"
      />
      <BaseCard
        backgroundColor="#ffffff"
        icon="bi bi-check-circle"
        iconColor="var(--color-green)"
        title="Completed Tasks"
        :value="stats.completedTasks.toString()"
        subtitle="This week"
      />
       <BaseCard
        backgroundColor="#ffffff"
        icon="bi bi-clock"
        iconColor="var(--color-warning)"
        title="Pending Tasks"
        :value="stats.pendingTasks.toString()"
        subtitle="Awaiting review"
      />
      <BaseCard
        backgroundColor="#ffffff"
        icon="bi bi-calendar-plus"
        iconColor="var(--card-blue)"
        title="Upcoming Tasks"
        :value="stats.upcomingTasks.toString()"
        subtitle="Next 7 days"
      />
    </div>

    <div class="row charts-row dashboard-section">
      <div class="col-md-4 mb-4">
        <BaseChart
          title="Site Views"
          subtitle="Daily website traffic overview"
          chart-type="line"
          :chart-data="lineData"
          :chart-options="lineChartOptions"
          :height="320"
          :show-actions="true"
          :show-footer="true"
          @refresh="refreshLineChart"
          @toggle-fullscreen="toggleFullscreen('line')"
        />
      </div>
      <div class="col-md-4 mb-4">
        <BaseChart
          title="Earnings Overview"
          subtitle="Revenue trends over time"
          chart-type="line"
          :chart-data="earningsData"
          :chart-options="earningsChartOptions"
          :height="320"
          :show-actions="true"
          :show-footer="true"
          @refresh="refreshEarningsChart"
          @toggle-fullscreen="toggleFullscreen('earnings')"
        />
      </div>
        <div class="col-md-4 mb-4">
        <BaseChart
          title="Visitors by Country"
          subtitle="Geographic distribution of users"
          chart-type="pie"
          :chart-data="pieData"
          :chart-options="pieChartOptions"
          :height="320"
          :show-actions="true"
          :show-footer="true"
          @refresh="refreshPieChart"
          @toggle-fullscreen="toggleFullscreen('pie')"
        />
      </div>
    </div>
    <div class="row dashboard-section">
      <div class="col-md-6 mb-4">
        <UserDetailsForm />
      </div>
      <div class="col-md-6 mb-4">
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
            :show-header="false"
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

    <!-- Toast Notification -->
    <div
      v-if="showToast"
      class="toast-notification"
      :class="{ 'toast-success': toastType === 'success', 'toast-error': toastType === 'error' }"
    >
      <i class="bi bi-check-circle" v-if="toastType === 'success'"></i>
      <i class="bi bi-exclamation-triangle" v-if="toastType === 'error'"></i>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script>
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseChart from "@/components/charts/BaseChart.vue";
import UserDetailsForm from "@/components/ui/UserDetailsForm.vue";
import UserDirectory from '@/components/ui/UserDirectory.vue';

// Import export libraries
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default {
  name: "Dashboard",
  components: {
    BaseCard,
    BaseChart,
    UserDetailsForm,
    UserDirectory
  },
  data() {
    return {
      stats: {
        visits: 1287687,
        sales: 141291,
        rate: 30,
        unique: "33.45%",
        earnings: [200, 450, 320, 690, 510],
        siteViews: [500, 300, 400, 700, 850],
        countryVisitors: [500, 300, 180, 120],
        // Task stats
        totalTasks: 19,
        completedTasks: 7,
        pendingTasks: 12,
        upcomingTasks: 5
      },
      baseChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      },
      // Fullscreen modal state
      fullscreenChart: null,
      fullscreenChartTitle: '',
      fullscreenChartSubtitle: '',
      fullscreenChartData: null,
      fullscreenChartOptions: null,
      showScrollIndicator: false,
      // Export state
      exportLoading: {
        png: false,
        pdf: false,
        excel: false
      },
      // Toast notification state
      showToast: false,
      toastMessage: '',
      toastType: 'success'
    }
  },
  methods: {
    // Helper method to get CSS custom property values
    getCSSVariable(variableName) {
      if (typeof window !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
      }
      return '';
    },

    // Chart refresh methods
    refreshLineChart() {
      console.log('Refreshing line chart...');
      // Generate new random data for site views
      this.stats.siteViews = [
        Math.floor(Math.random() * 800) + 200,
        Math.floor(Math.random() * 800) + 200,
        Math.floor(Math.random() * 800) + 200,
        Math.floor(Math.random() * 800) + 200,
        Math.floor(Math.random() * 800) + 200
      ];
      // Force update to ensure reactivity
      this.$forceUpdate();
    },

    refreshPieChart() {
      console.log('Refreshing pie chart...');
      // Generate new random data for country visitors
      this.stats.countryVisitors = [
        Math.floor(Math.random() * 600) + 100,
        Math.floor(Math.random() * 500) + 100,
        Math.floor(Math.random() * 300) + 50,
        Math.floor(Math.random() * 200) + 50
      ];
      // Force update to ensure reactivity
      this.$forceUpdate();
    },

    refreshEarningsChart() {
      console.log('Refreshing earnings chart...');
      // Generate new random data for earnings
      this.stats.earnings = [
        Math.floor(Math.random() * 500) + 100,
        Math.floor(Math.random() * 500) + 100,
        Math.floor(Math.random() * 500) + 100,
        Math.floor(Math.random() * 500) + 100,
        Math.floor(Math.random() * 500) + 100
      ];
      // Force update to ensure reactivity
      this.$forceUpdate();
    },

    // Fullscreen functionality
    toggleFullscreen(chartType) {
      console.log('Toggling fullscreen for:', chartType);

      switch (chartType) {
        case 'line':
          this.fullscreenChart = 'line';
          this.fullscreenChartTitle = 'Site Views - Fullscreen';
          this.fullscreenChartSubtitle = 'Daily website traffic overview';
          this.fullscreenChartData = this.lineData;
          this.fullscreenChartOptions = this.lineChartOptions;
          break;
        case 'pie':
          this.fullscreenChart = 'pie';
          this.fullscreenChartTitle = 'Visitors by Country - Fullscreen';
          this.fullscreenChartSubtitle = 'Geographic distribution of users';
          this.fullscreenChartData = this.pieData;
          this.fullscreenChartOptions = this.pieChartOptions;
          break;
        case 'earnings':
          this.fullscreenChart = 'line';
          this.fullscreenChartTitle = 'Earnings Overview - Fullscreen';
          this.fullscreenChartSubtitle = 'Revenue trends over time';
          this.fullscreenChartData = this.earningsData;
          this.fullscreenChartOptions = this.earningsChartOptions;
          break;
      }

      // Show scroll indicator after modal opens
      this.$nextTick(() => {
        this.checkScrollIndicator();
      });
    },

    closeFullscreen() {
      this.fullscreenChart = null;
      this.fullscreenChartTitle = '';
      this.fullscreenChartSubtitle = '';
      this.fullscreenChartData = null;
      this.fullscreenChartOptions = null;
      this.showScrollIndicator = false;
    },

    checkScrollIndicator() {
      if (this.$refs.fullscreenContainer) {
        const container = this.$refs.fullscreenContainer;
        const hasScroll = container.scrollHeight > container.clientHeight;
        this.showScrollIndicator = hasScroll;

        // Hide indicator after 3 seconds
        if (hasScroll) {
          setTimeout(() => {
            this.showScrollIndicator = false;
          }, 3000);
        }
      }
    },

    // Handle keyboard events
    handleKeydown(event) {
      if (event.key === 'Escape' && this.fullscreenChart) {
        this.closeFullscreen();
      }
    },

    // Export methods
    async exportChartAsPNG() {
      console.log('PNG Export clicked!');
      try {
        this.exportLoading.png = true;

        // Find the chart container in fullscreen modal
        const chartContainer = this.$refs.fullscreenContainer;
        if (!chartContainer) {
          throw new Error('Chart container not found');
        }

        // Use html2canvas to capture the chart
        const canvas = await html2canvas(chartContainer, {
          backgroundColor: '#ffffff',
          scale: 2, // Higher quality
          useCORS: true,
          allowTaint: true
        });

        // Convert to blob and download
        canvas.toBlob((blob) => {
          const fileName = `${this.fullscreenChartTitle.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.png`;
          saveAs(blob, fileName);
          this.showToastNotification('Chart exported as PNG successfully!', 'success');
        }, 'image/png');

      } catch (error) {
        console.error('Error exporting PNG:', error);
        this.showToastNotification('Failed to export chart as PNG. Please try again.', 'error');
      } finally {
        this.exportLoading.png = false;
      }
    },

    async exportChartAsPDF() {
      console.log('PDF Export clicked!');
      try {
        this.exportLoading.pdf = true;

        // Find the chart container in fullscreen modal
        const chartContainer = this.$refs.fullscreenContainer;
        if (!chartContainer) {
          throw new Error('Chart container not found');
        }

        // Use html2canvas to capture the chart
        const canvas = await html2canvas(chartContainer, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true
        });

        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        // Calculate dimensions to fit the page
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = (pdfHeight - imgHeight * ratio) / 2;

        // Add title
        pdf.setFontSize(16);
        pdf.text(this.fullscreenChartTitle, 20, 20);

        // Add chart image
        pdf.addImage(imgData, 'PNG', imgX, imgY + 10, imgWidth * ratio, imgHeight * ratio);

        // Add footer with date
        pdf.setFontSize(10);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, pdfHeight - 10);

        // Save PDF
        const fileName = `${this.fullscreenChartTitle.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
        this.showToastNotification('Chart exported as PDF successfully!', 'success');

      } catch (error) {
        console.error('Error exporting PDF:', error);
        this.showToastNotification('Failed to export chart as PDF. Please try again.', 'error');
      } finally {
        this.exportLoading.pdf = false;
      }
    },

    async exportChartAsExcel() {
      console.log('Excel Export clicked!');
      try {
        this.exportLoading.excel = true;

        // Get the current chart data
        let data = [];
        let headers = [];

        if (this.fullscreenChart === 'line') {
          // For line charts (Site Views or Earnings)
          if (this.fullscreenChartTitle.includes('Site Views')) {
            headers = ['Date', 'Site Views'];
            data = [
              ['May 13', this.stats.siteViews[0]],
              ['May 14', this.stats.siteViews[1]],
              ['May 15', this.stats.siteViews[2]],
              ['May 16', this.stats.siteViews[3]],
              ['May 17', this.stats.siteViews[4]]
            ];
          } else if (this.fullscreenChartTitle.includes('Earnings')) {
            headers = ['Date', 'Earnings ($)'];
            data = [
              ['Jan 1', this.stats.earnings[0]],
              ['Jan 2', this.stats.earnings[1]],
              ['Jan 3', this.stats.earnings[2]],
              ['Jan 4', this.stats.earnings[3]],
              ['Jan 5', this.stats.earnings[4]]
            ];
          }
        } else if (this.fullscreenChart === 'pie') {
          // For pie chart (Visitors by Country)
          headers = ['Country', 'Visitors'];
          data = [
            ['USA', this.stats.countryVisitors[0]],
            ['China', this.stats.countryVisitors[1]],
            ['Germany', this.stats.countryVisitors[2]],
            ['UK', this.stats.countryVisitors[3]]
          ];
        }

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const wsData = [headers, ...data];
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Chart Data');

        // Generate Excel file
        const fileName = `${this.fullscreenChartTitle.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
        this.showToastNotification('Chart data exported as Excel successfully!', 'success');

      } catch (error) {
        console.error('Error exporting Excel:', error);
        this.showToastNotification('Failed to export chart as Excel. Please try again.', 'error');
      } finally {
        this.exportLoading.excel = false;
      }
    },

    // Toast notification method
    showToastNotification(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;

      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }
  },

  mounted() {
    // Add keyboard event listener
    document.addEventListener('keydown', this.handleKeydown);
  },

  beforeDestroy() {
    // Remove keyboard event listener
    document.removeEventListener('keydown', this.handleKeydown);
  },
  computed: {
    lineData() {
      return {
        labels: ['May 13', 'May 14', 'May 15', 'May 16', 'May 17'],
        datasets: [
          {
            label: 'Site Views',
            data: this.stats.siteViews,
            borderColor: this.getCSSVariable('--card-blue'),
            fill: false
          }
        ]
      }
    },

    pieData() {
      return {
        labels: ['USA', 'China', 'Germany', 'UK'],
        datasets: [
          {
            backgroundColor: [
              this.getCSSVariable('--card-blue'),
              this.getCSSVariable('--color-red'),
              this.getCSSVariable('--color-green'),
              this.getCSSVariable('--color-warning')
            ],
            data: this.stats.countryVisitors
          }
        ]
      }
    },

    earningsData() {
      return {
        labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5'],
        datasets: [
          {
            label: 'Earnings',
            data: this.stats.earnings,
            backgroundColor: this.getCSSVariable('--color-red-transparent'),
            borderColor: this.getCSSVariable('--color-red'),
            fill: true
          }
        ]
      }
    },
    formatted() {
      return {
        visits: this.stats.visits.toLocaleString(),
        sales: `$${this.stats.sales.toLocaleString()}`,
        rate: `${this.stats.rate}%`
      }
    },

    // Specific chart options
    lineChartOptions() {
      return {
        ...this.baseChartOptions,
        scales: {
          x: {
            grid: {
              color: 'var(--chart-grid-color)',
              borderColor: 'var(--color-light)'
            },
            ticks: {
              font: { size: 11 },
              color: 'var(--color-secondary)'
            }
          },
          y: {
            grid: {
              color: 'var(--chart-grid-color)',
              borderColor: 'var(--color-light)'
            },
            ticks: {
              font: { size: 11 },
              color: 'var(--color-secondary)'
            },
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: this.getCSSVariable('--card-blue'),
            borderWidth: 1
          }
        }
      }
    },

    pieChartOptions() {
      return {
        ...this.baseChartOptions,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              font: { size: 12 },
              color: 'var(--color-secondary)'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff'
          }
        }
      }
    },

    earningsChartOptions() {
      return {
        ...this.baseChartOptions,
        scales: {
          x: {
            grid: {
              color: 'var(--chart-grid-color)',
              borderColor: 'var(--color-light)'
            },
            ticks: {
              font: { size: 11 },
              color: 'var(--color-secondary)'
            }
          },
          y: {
            grid: {
              color: 'var(--chart-grid-color)',
              borderColor: 'var(--color-light)'
            },
            ticks: {
              font: { size: 11 },
              color: 'var(--color-secondary)'
            },
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: this.getCSSVariable('--color-red'),
            borderWidth: 1
          }
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6
          }
        }
      }
    }
  }
}
</script>

<style scoped>
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

/* Animation for modal */
.fullscreen-modal {
  animation: fadeIn 0.3s ease-out;
}

.fullscreen-content {
  animation: slideIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: scale(0.9) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
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
    padding: 16px 20px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .fullscreen-title {
    font-size: 16px;
  }

  .fullscreen-chart-container {
    padding: 16px;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Ensure smooth scrolling */
.fullscreen-modal {
  scroll-behavior: smooth;
}

.fullscreen-chart-container {
  scroll-behavior: smooth;
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

/* Responsive adjustments for additional content */
@media (max-width: 768px) {
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

/* Toast Notification Styles */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #ffffff;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10000;
  min-width: 250px;
  animation: slideInRight 0.3s ease-out;
  border-left: 4px solid;
}

.toast-success {
  border-left-color: var(--color-green);
  color: var(--color-green);
}

.toast-error {
  border-left-color: var(--color-red);
  color: var(--color-red);
}

.toast-notification i {
  font-size: 16px;
}

.toast-notification span {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-black);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive toast */
@media (max-width: 768px) {
  .toast-notification {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
  }
}

/* Stats Cards Row Styling */
.row {
  margin-bottom: 30px;
}

.row .col-md-3 {
  margin-bottom: 20px;
}

/* Dashboard Title */
h2.mb-4 {
  color: var(--color-black);
  font-weight: 600;
  margin-bottom: 30px !important;
}

/* Ensure consistent spacing */
.stats-card {
  height: 100%;
}

/* Dashboard Layout Spacing */
.container-fluid {
  padding: 20px;
}

/* Consistent section spacing */
.row {
  margin-bottom: 40px;
}

/* Reduce space between stats cards and charts */
.row:first-of-type {
  margin-bottom: 25px;
}

.charts-row {
  margin-top: 0;
  margin-bottom: 40px;
}

/* Dashboard Title */
h2.mb-4 {
  color: var(--color-black);
  font-weight: 600;
  margin-bottom: 40px !important;
}

/* Stats Cards Spacing */
.col-md-3 {
  margin-bottom: 20px;
}

/* Forms and Directory Section */
.row:last-child {
  margin-bottom: 20px;
}

/* Ensure consistent spacing between all major sections */
.dashboard-section {
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 15px;
  }

  .row {
    margin-bottom: 30px;
  }

  .row:first-of-type {
    margin-bottom: 20px;
  }

  .charts-row {
    margin-bottom: 30px;
  }

  h2.mb-4 {
    margin-bottom: 30px !important;
  }

  .col-md-3 {
    margin-bottom: 15px;
  }
}
</style>
