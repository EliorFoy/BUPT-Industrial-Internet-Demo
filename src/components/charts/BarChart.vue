<template>
  <div class="chart-container">
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import 'chart.js/auto'

export default {
  name: 'BarChart',
  extends: Bar,
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
        label: '生产数据',
        data: this.dataset.map(d => d.value),
        backgroundColor: '#36A2EB',
        borderWidth: 1
      }]
    }, {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    })
  }
}
</script>

<style scoped>
.chart-container {
  height: 300px;
  margin: 15px 0;
}
</style>