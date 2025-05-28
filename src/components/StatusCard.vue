<template>
  <div class="status-card" :class="type">
    <div class="title">{{ title }}</div>
    <div class="value">{{ count }}</div>
  </div>
</template>

<script>
export default {
  name: 'StatusCard',
  props: {
    title: String,
    count: Number,
    type: {
      type: String,
      default: 'default',
      validator: (val) => ['default', 'warning', 'success', 'danger'].includes(val)
    }
  }
}
</script>

<style scoped>
.status-card {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  background: #f5f7fa;
}
.status-card.warning { background: #fff6ec; color: #e6a23c; }
.status-card.success { background: #f0f9eb; color: #67c23a; }
.status-card.danger { background: #fef0f0; color: #f56c6c; }
.title { font-size: 14px; margin-bottom: 8px; }
.value { font-size: 24px; font-weight: bold; }
</style>