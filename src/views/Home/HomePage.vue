<script>
export default {
  name: "HomePage",
  data() {
    return {
      cards: [
        {
          title: '设备监控',
          icon: 'el-icon-monitor',
          type: 'monitor'
        },
        {
          title: '生产监控', 
          icon: 'el-icon-data-line',
          type: 'production'
        },
        {
          title: '工单管理',
          icon: 'el-icon-document',
          type: 'order'
        }
      ]
    }
  },
  methods: {
    handleCardClick(type) {
      const routeMap = {
        monitor: 'equipment-monitor',
        production: 'production-monitor',
        order: 'work-order-monitoring'  // 修正路由名称
      }
      this.$router.push({ name: routeMap[type] });
    }
  }
}
</script>

<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="8" v-for="(card, index) in cards" :key="index">
        <el-card 
          class="function-card"
          shadow="hover"
          @click.native="handleCardClick(card.type)">
          <div class="card-content">
            <i :class="card.icon" class="card-icon"></i>
            <h3 class="card-title">{{ card.title }}</h3>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
}

.function-card {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.function-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card-content {
  text-align: center;
}

.card-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 15px;
}

.card-title {
  color: #303133;
  margin: 0;
}
</style>