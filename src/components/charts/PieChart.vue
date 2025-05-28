<template>
  <div class="chart-container">
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs'
import 'chart.js/auto'

export default {
  name: 'PieChart',
  extends: Pie,
  props: {
    dataset: {
      type: Array,
      required: true,
      validator: value => value.every(item => 'label' in item && 'value' in item)
    }
  },
  mounted() {
    this.renderChart({
      labels: this.dataset.map(d => d.label),
      datasets: [{
        data: this.dataset.map(d => d.value),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', 
          '#4BC0C0', '#9966FF'
        ]
      }]
    }, {
      plugins: {
        legend: { position: 'right' }
      }
    })
  }
}
</script>

<style scoped>
.chart-container {
  max-width: 450px;
  margin: 0 auto;
  height: 320px;
}
</style>