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
export default {
  created() {
    // 初始化设备数据到 Vuex store
    this.$store.commit('SET_DEVICES', this.devices)
  },
  data() {
    return {
      locationFilter: 'all',
      devices: [
        {
          id: 1,
          image: 'https://via.placeholder.com/80x60',
          location: '花都新工厂',
          name: '机加线M3内喷电机',
          status: '正常',
          sensorId: 'SN-001',
          sensors: {
            temperature: [22, 24, 23, 25, 26], 
            humidity: [45, 48, 50, 47, 49]
          }
        },
        {
          id: 2,
          image: 'https://via.placeholder.com/80x60',
          location: '花都新工厂', 
          name: '机加线工控机柜',
          status: '正常'
        },
        {
          id: 3,
          image: 'https://via.placeholder.com/80x60',
          location: '花都新工厂',
          name: '机加线M5内喷电机',
          status: '正常'
        },
        // 新增黄埔示范线设备
        {
          id: 4,
          image: 'https://via.placeholder.com/80x60',
          location: '黄埔示范线',
          name: '涂装线机器人手臂',
          status: '正常'
        },
        {
          id: 5, 
          image: 'https://via.placeholder.com/80x60',
          location: '黄埔示范线',
          name: '总装线传送带',
          status: '异常'
        },
        // 新增异常设备
        {
          id: 6,
          image: 'https://via.placeholder.com/80x60',
          location: '花都新工厂',
          name: '焊接工作站',
          status: '异常'
        }
      ]
    };
  },
  computed: {
    filteredDevices() {
      if (this.locationFilter === 'all') {
        return this.devices;
      } else {
        return this.devices.filter(device => device.location === this.locationFilter);
      }
    },
    // 修改为基于filteredDevices统计
    total() {
      return this.filteredDevices.length
    },
    normal() {
      return this.filteredDevices.filter(device => device.status === '正常').length
    },
    abnormal() {
      return this.filteredDevices.filter(device => device.status === '异常').length
    }
  },
  mounted() {
    console.log('设备管理组件已加载');
  },
  methods: {
    // 这里可以添加组件的方法
    viewDetail(device) {
      this.$router.push({
        path: `/equipment-monitor/detail/${device.id}`,
        query: {
          name: device.name,
          status: device.status,
          location: device.location
        }
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


// 在store.js的actions中添加：
async initDevices({ commit }, devices) {
  commit('SET_DEVICES', devices)
}
