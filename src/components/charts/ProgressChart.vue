<template>
  <div class="progress-chart">
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { Radar } from 'vue-chartjs'
import 'chart.js/auto'

export default {
  name: 'ProgressChart',
  extends: Radar,
  props: {
    metrics: {
      type: Array,
      required: true,
      validator(value) {
        return Array.isArray(value) && 
          value.every(item => 
            typeof item === 'object' &&
            'axis' in item &&
            'value' in item
          )
      }
    }
  },
  mounted() {
    this.renderChart({
      labels: this.metrics.map(m => m.axis),
      datasets: [{
        label: '能力评估',
        data: this.metrics.map(m => m.value),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: '#4BC0C0'
      }]
    }, {
      scale: {
        ticks: { 
          beginAtZero: true,
          max: 100,
          min: 0
        }
      }
    })
  }
}
</script>

<style scoped>
.progress-chart {
  height: 350px;
}
</style>