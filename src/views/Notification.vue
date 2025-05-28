<script>
import axios from 'axios';

export default {
  name: "Notification",
  data() {
    return {
      taskData: []
    }
  },
  created() {
    this.fetchTaskData();
  },
  methods: {
    async fetchTaskData() {
      try {
        const response = await axios.get('http://10.160.4.92:8018/cloudForm/getAllFormByUid/19');
        if (response.data.code === 200 && response.data.ok) {
          this.taskData = response.data.data;
        }
      } catch (error) {
        console.error('获取任务数据失败:', error);
        this.$message.error('获取任务数据失败');
      }
    },
    refreshTasks() {
      this.fetchTaskData();
      this.$message.success('刷新成功');
    },
    viewTaskDetail(task) {
      console.log('准备查看任务详情:', task);
      if (!task || !task.form) {
        this.$message.error('任务数据不完整');
        return;
      }
      
      const taskId = task.id;
      if (!taskId) {
        this.$message.error('任务ID不存在');
        return;
      }
      
      this.$router.push({
        name: 'TaskDetail',
        params: { taskId: taskId }
      });
    },
    navigateTo(page) {
      this.$router.push({ name: page });
    }
  }
}
</script>

<template>
  <div class="notification-container">
    <!-- 顶部标题栏 -->
    <div class="header">
      <h2>通知</h2>
      <el-button type="primary" icon="el-icon-refresh" @click="refreshTasks">刷新</el-button>
    </div>

    <!-- 任务列表 -->
    <div class="task-list">
      <el-card v-for="(task, index) in taskData" 
               :key="index" 
               class="task-card"
               shadow="hover">
        <div class="task-header">
          <span class="task-type">{{ task.form.taskType }}</span>
          <span :class="['task-status', task.form.status === '已完成' ? 'status-completed' : 'status-pending']">
            {{ task.form.status }}
          </span>
        </div>
        <div class="task-content">
          <p class="task-title">{{ task.form.taskDetail }}</p>
          <p class="task-time">开始时间：{{ task.form.taskStartTime }}</p>
        </div>
        <div class="task-footer">
          <el-button type="primary" size="small" @click="viewTaskDetail(task)">查看详情</el-button>
        </div>
      </el-card>
    </div>

    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <div class="nav-item" @click="navigateTo('home')">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </div>
      <div class="nav-item" @click="navigateTo('tasks')">
        <i class="el-icon-tickets"></i>
        <span>任务</span>
      </div>
      <div class="nav-item" @click="navigateTo('notifications')">
        <i class="el-icon-bell"></i>
        <span>通知</span>
      </div>
      <div class="nav-item" @click="navigateTo('profile')">
        <i class="el-icon-user"></i>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-container {
  font-family: 'Arial', sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 60px;
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

.task-list {
  padding: 20px;
}

.task-card {
  margin-bottom: 15px;
  border-radius: 8px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-type {
  font-weight: bold;
  color: #1e88e5;
}

.task-status {
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

.task-content {
  margin: 10px 0;
}

.task-title {
  font-size: 16px;
  color: #333;
  margin: 5px 0;
}

.task-time {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.task-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  font-size: 12px;
  cursor: pointer;
}

.nav-item i {
  font-size: 20px;
  margin-bottom: 5px;
}
</style>