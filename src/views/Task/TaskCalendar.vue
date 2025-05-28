<template>
  <div class="task-calendar-container">
    <!-- 顶部标题栏 -->
    <div class="header">
      <h2>任务</h2>
      <el-button type="primary" icon="el-icon-plus" @click="addTask">添加</el-button>
    </div>

    <!-- 日历部分 -->
    <div class="calendar-container">
      <!-- 日历头部标题 -->
      <div class="calendar-header">
        <h3>{{ currentMonth }}</h3>
      </div>

      <!-- 日历导航 -->
      <div class="calendar-nav">
        <el-button @click="prevMonth">上个月</el-button>
        <el-button @click="nextMonth">下个月</el-button>
      </div>

      <!-- 日历表格 -->
      <div class="calendar-table">
        <!-- 星期头部 -->
        <div class="week-headers">
          <div class="week-header">日</div>
          <div class="week-header">一</div>
          <div class="week-header">二</div>
          <div class="week-header">三</div>
          <div class="week-header">四</div>
          <div class="week-header">五</div>
          <div class="week-header">六</div>
        </div>

        <!-- 日历日期 -->
        <div class="calendar-days">
          <!-- 动态生成的日历单元格 -->
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="day-cell"
            :class="{ 'is-selected': day.isSelected, 'is-today': day.isToday }"
            @click="selectDay(day)"
          >
            <span>{{ day.date }}</span>
            <span class="dot" v-if="day.hasEvent"></span>
          </div>
        </div>
      </div>

      <!-- 显示选中日期的详情 -->
      <div class="selected-date-info" v-if="selectedDay">
        <h4>选中的日期: {{ selectedDay.formattedDate }}</h4>
        <el-button type="primary" @click="viewEvents">查看事件</el-button>
      </div>

      <!-- 客服悬浮按钮 -->
      <div class="floating-button">
        <i class="el-icon-message"></i>
      </div>
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

    <!-- 事件弹出框 -->
    <el-dialog
      title="日期事件"
      :visible.sync="eventsDialogVisible"
      width="50%"
    >
      <div v-if="selectedDay">
        <p v-if="selectedDay.events.length === 0">该日期没有事件。</p>
        <div v-else>
          <div v-for="(event, index) in selectedDay.events" :key="index">
            <p><strong>事件 {{ index + 1 }}:</strong> {{ event }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TaskCalendar',
  data() {
    return {
      currentDate: new Date(),
      selectedDay: null,
      eventsDialogVisible: false,
      calendarDays: [],
      // 模拟数据：特定日期的事件
      eventsData: {
        '2025-05-13': ['巡检任务'],
        '2025-05-15': ['维护任务'],
        '2025-05-20': ['设备检查'],
      },
    };
  },
  computed: {
    currentMonth() {
      return `${this.currentDate.getFullYear()}年${this.currentDate.getMonth() + 1}月`;
    },
  },
  created() {
    this.generateCalendar();
  },
  methods: {
    // 生成日历数据
    generateCalendar() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startDay = firstDay.getDay(); // 0 表示星期日

      // 清空日历数据
      this.calendarDays = [];

      // 添加空白单元格以对齐星期
      for (let i = 0; i < startDay; i++) {
        this.calendarDays.push({
          date: '',
          hasEvent: false,
          isToday: false,
          isSelected: false,
        });
      }

      // 填充日期数据
      for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = this.formatDate(year, month, i);
        const hasEvent = this.eventsData[dateStr] ? true : false;
        const isToday = this.isToday(year, month, i);
        const isSelected = this.selectedDay && this.selectedDay.dateStr === dateStr;

        this.calendarDays.push({
          date: i,
          dateStr,
          hasEvent,
          isToday,
          isSelected,
          events: this.eventsData[dateStr] || [],
        });
      }

      // 添加额外的空白单元格以填满最后一行
      const totalCells = startDay + daysInMonth;
      const cellsToAdd = 42 - totalCells; // 6行 * 7列 = 42单元格
      for (let i = 0; i < cellsToAdd; i++) {
        this.calendarDays.push({
          date: '',
          hasEvent: false,
          isToday: false,
          isSelected: false,
        });
      }
    },

    // 格式化日期为 YYYY-MM-DD 字符串
    formatDate(year, month, day) {
      return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    },

    // 检查是否是今天
    isToday(year, month, day) {
      const today = new Date();
      return (
        today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
      );
    },

    // 选择日期
    selectDay(day) {
      if (!day.date) return; // 不选择空白单元格
      this.selectedDay = {
        formattedDate: `${this.currentDate.getFullYear()}年${this.currentDate.getMonth() + 1}月${day.date}日`,
        dateStr: day.dateStr,
        events: day.events,
      };
    },

    // 查看事件
    viewEvents() {
      this.eventsDialogVisible = true;
    },

    // 添加任务
    addTask() {
      // 添加任务的逻辑
      this.$message('添加任务功能将在这里实现');
    },

    // 导航到特定页面
    navigateTo(page) {
      // 导航逻辑
      this.$message(`导航到 ${page} 页面`);
    },

    // 切换到上个月
    prevMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        this.currentDate.getDate()
      );
      this.generateCalendar();
    },

    // 切换到下个月
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        this.currentDate.getDate()
      );
      this.generateCalendar();
    },
  },
};
</script>

<style scoped>
.task-calendar-container {
  font-family: 'Arial', sans-serif;
  background-color: #ffffff;
  height: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* 顶部标题栏样式 */
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

.header .el-button {
  background-color: #1e88e5;
  border-color: #1e88e5;
}

/* 日历容器样式 */
.calendar-container {
  padding: 20px;
  overflow: hidden;
  position: relative;
}

/* 日历头部标题 */
.calendar-header {
  text-align: center;
  margin-bottom: 20px;
}

.calendar-header h3 {
  margin: 0;
  font-weight: normal;
}

/* 日历导航按钮 */
.calendar-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

/* 日历表格样式 */
.calendar-table {
  width: 100%;
}

/* 星期头部样式 */
.week-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 2px;
}

.week-header {
  text-align: center;
  padding: 10px;
  background-color: #f5f5f5;
  font-weight: bold;
  border-radius: 4px;
}

/* 日历日期单元格样式 */
.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 20px;
}

.day-cell {
  text-align: center;
  padding: 15px 10px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
}

.day-cell:hover {
  background-color: #f0f0f0;
}

.day-cell.is-selected {
  background-color: #f44336;
  color: white;
}

.day-cell.is-today {
  background-color: #e3f2fd;
  font-weight: bold;
}

.day-cell span {
  display: block;
}

.dot {
  display: block;
  width: 6px;
  height: 6px;
  background-color: #1e88e5;
  border-radius: 50%;
  margin: 5px auto;
}

/* 选中日期详情 */
.selected-date-info {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-top: 10px;
}

/* 客服悬浮按钮样式 */
.floating-button {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: #f44336;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

/* 底部导航栏样式 */
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