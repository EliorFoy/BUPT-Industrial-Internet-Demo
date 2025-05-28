<template>
  <div class="device-selector">
    <el-transfer
      v-model="selectedDevices"
      :data="devices"
      :titles="['可选设备', '已选设备']"
      :props="{ key: 'id', label: 'name' }"
    >
      <template #default="{ option }">
        <div class="device-item">
          <span>{{ option.name }}</span>
          <el-tag 
            :type="deviceStatusMap[option.status]"
            size="mini"
          >{{ option.status }}</el-tag>
        </div>
      </template>
    </el-transfer>
  </div>
</template>

<script>
export default {
  props: {
    value: Array,
    devices: Array
  },
  data() {
    return {
      selectedDevices: this.value,
      deviceStatusMap: {
        normal: 'success',
        warning: 'warning',
        error: 'danger'
      }
    }
  },
  watch: {
    selectedDevices(newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>

<style scoped>
.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>