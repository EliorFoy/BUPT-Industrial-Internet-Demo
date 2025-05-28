<template>
  <div class="task-detail-container">
    <!-- 顶部标题栏 -->
    <div class="header">
      <el-button icon="el-icon-back" @click="goBack">返回</el-button>
      <h2>任务详情</h2>
      <div style="width: 40px"></div>
    </div>

    <!-- 任务详情内容 -->
    <div class="task-content" v-if="taskDetail">
      <el-card class="detail-card">
        <div class="detail-item">
          <span class="label">任务类型：</span>
          <span class="value">{{ taskDetail.form.taskType }}</span>
        </div>
        <div class="detail-item">
          <span class="label">任务内容：</span>
          <span class="value">{{ taskDetail.form.taskDetail }}</span>
        </div>
        <div class="detail-item">
          <span class="label">开始时间：</span>
          <span class="value">{{ taskDetail.form.taskStartTime }}</span>
        </div>
        <div class="detail-item">
          <span class="label">结束时间：</span>
          <span class="value">{{ taskDetail.form.taskEndTime }}</span>
        </div>
        <div class="detail-item">
          <span class="label">状态：</span>
          <span :class="['value', 'status', taskDetail.form.status === '已完成' ? 'status-completed' : 'status-pending']">
            {{ taskDetail.form.status }}
          </span>
        </div>
        <div class="detail-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ formatDateTime(taskDetail.createTime) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">更新时间：</span>
          <span class="value">{{ formatDateTime(taskDetail.updateTime) }}</span>
        </div>
      </el-card>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-container">
      <el-skeleton :rows="6" animated />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TaskDetail',
  data() {
    return {
      taskDetail: null
    }
  },
  created() {
    this.fetchTaskDetail();
  },
  methods: {
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return '暂无';
      const date = new Date(dateTimeStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    },
    async fetchTaskDetail() {
      try {
        const taskId = this.$route.params.taskId;
        console.log('获取任务详情，任务ID:', taskId);
        
        if (!taskId) {
          this.$message.error('任务ID不存在');
          return;
        }

        const response = await axios.get(`http://10.160.4.92:8018/cloudForm/getFormById/${taskId}`);
        console.log('API响应:', response.data);
        
        if (response.data.code === 200 && response.data.ok) {
          this.taskDetail = response.data.data;
          console.log('任务详情数据:', this.taskDetail);
        } else {
          this.$message.error(response.data.message || '获取任务详情失败');
        }
      } catch (error) {
        console.error('获取任务详情失败:', error);
        this.$message.error('获取任务详情失败: ' + (error.message || '未知错误'));
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.task-detail-container {
  font-family: 'Arial', sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #1e88e5;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header h2 {
  margin: 0;
  font-weight: normal;
}

.task-content {
  padding: 20px;
}

.detail-card {
  border-radius: 8px;
}

.detail-item {
  margin: 15px 0;
  display: flex;
  align-items: flex-start;
}

.label {
  width: 100px;
  color: #666;
  font-weight: bold;
}

.value {
  flex: 1;
  color: #333;
}

.status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.status-completed {
  background-color: #67c23a;
  color: white;
}

.status-pending {
  background-color: #e6a23c;
  color: white;
}

.loading-container {
  padding: 20px;
}
</style>
