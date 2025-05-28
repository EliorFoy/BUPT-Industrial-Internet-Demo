<template>
  <div id="app">
    <!-- 登录/错误页不显示导航 -->
    <header v-if="showNav" class="app-header">
      <div class="nav-container">
        <!-- 系统标识 -->
        <div class="brand">
          <img src="./assets/403.png" class="logo" alt="logo">
          <span class="system-name">工业工单系统</span>
        </div>

        <!-- 用户信息 -->
        <div class="user-info">
          <el-tag type="info">{{ currentRoleLabel }}</el-tag>
          <el-button
            type="text"
            icon="el-icon-switch-button"
            @click="handleLogout"
          >退出系统</el-button>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main :class="{ 'with-nav': showNav }">
      <router-view/>
    </main>

    <!-- 新增底部导航栏 -->
    <div v-if="showBottomNav" class="bottom-nav">
      <div class="nav-item" :class="{ active: $route.name === 'home' }" @click="navigateTo('home')">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </div>
      <div class="nav-item" :class="{ active: $route.name === 'tasks' }" @click="navigateTo('tasks')">
        <i class="el-icon-tickets"></i>
        <span>任务</span>
      </div>
      <div class="nav-item" :class="{ active: $route.name === 'notifications' }" @click="navigateTo('notifications')">
        <i class="el-icon-bell"></i>
        <span>通知</span>
      </div>
      <div class="nav-item" :class="{ active: $route.name === 'profile' }" @click="navigateTo('profile')">
        <i class="el-icon-user"></i>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentRole: localStorage.getItem('userRole') || ''
    }
  },
  computed: {
    // 判断是否显示导航栏
    showNav() {
      return !['Login','create-task', 'ErrorMaker','equipment-monitor', 'production-monitor', 'work-order-monitoring','equipment-detail'].includes(this.$route.name)
    },
    showBottomNav() {
      return this.showNav && ![].includes(this.$route.name)
    },
    // 当前用户角色标签
    currentRoleLabel() {
      const roleMap = {
        supervisor: '设备主管',
        manager: '产线工长',
        teamLeader: '班组长',
        member: '操作组员'
      }
      return this.currentRole ? roleMap[this.currentRole] || '未知角色' : '未登录'
    }
  },
  watch: {
    // 监听路由变化
    '$route': {
      immediate: true,
      handler() {
        this.currentRole = localStorage.getItem('userRole') || ''
      }
    }
  },
  created() {
    // 初始化用户角色
    this.currentRole = localStorage.getItem('userRole') || ''
    
    // 监听用户角色变化
    this.$root.$on('user-role-changed', (role) => {
      this.currentRole = role
    })
  },
  beforeDestroy() {
    // 清理事件监听
    this.$root.$off('user-role-changed')
  },
  methods: {
    // 退出登录
    handleLogout() {
      localStorage.clear()
      this.currentRole = ''
      this.$router.replace('/login').catch(() => {})
    },

    // 新增导航方法
    navigateTo(routeName) {
      if (this.$route.name !== routeName) {
        this.$router.push({ name: routeName }).catch(() => {})
      }
    },
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.app-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 0 20px;

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .brand {
    display: flex;
    align-items: center;

    .logo {
      width: 36px;
      height: 36px;
      margin-right: 12px;
    }

    .system-name {
      font-size: 20px;
      font-weight: 600;
      color: #304156;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 20px;

    .el-button {
      padding: 8px 12px;
      color: #606266;

      &:hover {
        color: #409EFF;
      }
    }
  }
}

main {
  &.with-nav {
    padding: 20px;
    margin-top: 60px; /* 与header高度一致 */
    min-height: calc(100vh - 60px);
    background: #f5f7fa;
  }

  /* 主内容容器 */
  .content-container {
    max-width: 1200px;
    margin: 0 auto;
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  }
}

// 新增底部导航样式
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 1000;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #666;
    font-size: 12px;
    padding: 6px 12px;
    transition: all 0.2s;
    cursor: pointer;

    i {
      font-size: 20px;
      margin-bottom: 4px;
    }

    &:hover {
      color: #409EFF;
    }

    &.active {
      color: #409EFF;
      i {
        color: #409EFF;
      }
    }
  }
}

// 调整主内容区域底部间距
main.with-nav {
  margin-top: 0; /* 移除顶部间距 */
  padding: 20px 0; /* 上下留白 */
  min-height: calc(100vh - 120px); /* 包含顶部导航和底部导航高度 */
}

.bottom-nav {
  height: 60px; /* 固定底部导航高度 */
}

// 移动端适配
@media (max-width: 768px) {
  .app-header {
    display: none;
  }

  .bottom-nav {
    display: flex;
  }
}

/* 添加在style部分 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
