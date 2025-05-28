<template>
  <div class="chart-container">
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import 'chart.js/auto'

export default {
  name: 'LineChart',
  extends: Line,
  props: {
    chartData: {
      type: Array,
      required: true,
      validator: value => value.every(item => 'label' in item && 'value' in item)
    }
  },
  mounted() {
    this.renderChart({
      labels: this.chartData.map(d => d.label),
      datasets: [{
        label: '趋势数据',
        data: this.chartData.map(d => d.value),
        borderColor: '#409EFF',
        backgroundColor: 'rgba(64, 158, 255, 0.1)',
        tension: 0.4
      }]
    }, {
      responsive: true,
      maintainAspectRatio: false
    })
  }
}
</script>

<style scoped>
.chart-container {
  height: 400px;
}
</style>