<template>
  <div class="card chart-card">
    <div class="card-body">
      <h6 class="card-title">Site Views</h6>
      <canvas ref="canvas" :key="chartKey"></canvas>
    </div>
  </div>
</template>

<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  name: 'LineChart',
  extends: Line,
  mixins: [reactiveProp],
  data() {
    return {
      chartKey: 0
    }
  },
  props: ['chartData'],
  watch: {
    chartData: {
      handler() {
        this.refreshChart();
      },
      deep: true
    }
  },
  mounted() {
    this.renderChart(this.chartData)
  },
  methods: {
    refreshChart() {
      // Destroy existing chart and re-render
      if (this.$data._chart) {
        this.$data._chart.destroy();
      }
      this.chartKey += 1;
      this.$nextTick(() => {
        this.renderChart(this.chartData);
      });
    }
  }
}
</script>

<style scoped>
.chart-card {
  border: 1px solid var(--color-light);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  background: #ffffff;
  height: auto;
}

.chart-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.card-body {
  padding: 20px;
}

.card-title {
  font-weight: 600;
  color: var(--color-black);
  font-size: 14px;
  margin-bottom: 16px;
}
</style>
