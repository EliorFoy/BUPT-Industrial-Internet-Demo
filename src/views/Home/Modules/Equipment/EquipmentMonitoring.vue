<template>
  <div>
    <!-- 顶部标题栏 -->
    <div class="header">
      <el-button 
        type="text" 
        icon="el-icon-back" 
        @click="$router.go(-1)"
        style="color: white; margin-right: 15px; font-size: 16px">
      </el-button>
      <h1>设备管理</h1>
    </div>

    <!-- 设备统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="number">{{ total }}</div>
        <div class="label">全部设备</div>
      </div>
      <div class="stat-card">
        <div class="number">{{ normal }}</div>
        <div class="label">正常</div>
      </div>
      <div class="stat-card">
        <div class="number">{{ abnormal }}</div>
        <div class="label">异常</div>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-item">
        <span class="label">设备位置</span>
        <el-select v-model="locationFilter" placeholder="全部">
          <el-option label="全部" value="all"></el-option>
          <el-option label="花都" value="花都新工厂"></el-option>
          <el-option label="黄埔" value="黄埔示范线"></el-option>
        </el-select>
      </div>
    </div>

    <!-- 设备列表 -->
    <div class="device-list">
      <div 
        class="device-item" 
        v-for="(device, index) in filteredDevices" 
        :key="index"
        @click="viewDetail(device)"
        style="cursor: pointer">  <!-- 添加点击指针样式 -->
        <el-image :src="device.image" style="width: 80px; height: 60px;"></el-image>
        <div class="device-info">
          <div class="location">{{ device.location }}</div>
          <div class="name">{{ device.name }}</div>
        </div>
        <div class="status-tag">
          <el-tag :type="device.status === '正常' ? 'success' : 'danger'">{{ device.status }}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      locationFilter: 'all'
    };
  },
  computed: {
    ...mapGetters('equipment', [
      'getDevicesByLocation',
      'getDeviceStats'
    ]),
    filteredDevices() {
      return this.getDevicesByLocation(this.locationFilter);
    },
    total() {
      return this.getDeviceStats.total;
    },
    normal() {
      return this.getDeviceStats.normal;
    },
    abnormal() {
      return this.getDeviceStats.abnormal;
    }
  },
  mounted() {
    console.log('设备管理组件已加载');
  },
  methods: {
    viewDetail(device) {
      this.$router.push({
        name: 'equipment-detail',
        params: { id: device.id }
      });
    }
  }
}
</script>

<style scoped>
.header {
  background-color: #409eff;
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
}

.menu-icon {
  margin-right: 15px;
  font-size: 20px;
}

h1 {
  margin: 0;
  font-size: 18px;
}

.stat-cards {
  display: flex;
  justify-content: space-around;
  background-color: white;
  padding: 15px;
  margin: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-card {
  width: 33%;
  text-align: center;
  padding: 10px;
}

.number {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 5px;
}

.label {
  font-size: 14px;
  color: #666;
}

.filter-section {
  background-color: white;
  padding: 10px 15px;
  margin: 0 10px 10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.filter-item {
  display: flex;
  align-items: center;
}

.label {
  margin-right: 10px;
}

.device-list {
  background-color: white;
  margin: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.device-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.device-info {
  margin-left: 15px;
}

.location {
  color: #409eff;
  margin-bottom: 5px;
  font-size: 14px;
}

.name {
  font-size: 14px;
}

.status-tag {
  margin-left: auto;
}
</style>
