<template>
  <div class="profile-container">
    <!-- 顶部标题栏 -->
    <div class="header">
      <span>我的</span>
    </div>

    <!-- 用户信息区域 -->
    <div class="profile-info">
      <!-- 左侧部门信息 -->
      <div class="info-section left-section">
        <div class="info-title">部门</div>
        <div class="info-content">运维部门</div>
      </div>

      <!-- 中间用户信息 -->
      <div class="user-info">
        <div class="user-avatar">
          <el-avatar :size="60" :src="avatarUrl">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2UwNGM4ZiIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM3oiLz48L3N2Zz4=" alt="用户头像">
          </el-avatar>
        </div>
        <div class="user-details">
          <div class="username">test-zg</div>
          <div class="team-info">班组：暂无</div>
        </div>
      </div>

      <!-- 右侧职位信息 -->
      <div class="info-section right-section">
        <div class="info-title">职位</div>
        <div class="info-content">主管</div>
      </div>
    </div>

    <!-- 底部列表项 -->
    <div class="list-menu">
      <div class="list-item" @click="handleItemClick('电话信息')">
        <i class="el-icon-phone"></i>
        <span>电话信息</span>
        <i class="el-icon-arrow-right right-arrow"></i>
      </div>

      <div class="list-item" @click="handleItemClick('个人信息')">
        <i class="el-icon-user"></i>
        <span>个人信息</span>
        <i class="el-icon-arrow-right right-arrow"></i>
      </div>

      <div class="list-item" @click="handleItemClick('人员管理')">
        <i class="el-icon-user-solid"></i>
        <span>人员管理</span>
        <i class="el-icon-arrow-right right-arrow"></i>
      </div>

      <div class="list-item" @click="logout">
        <i class="el-icon-switch-button"></i>
        <span>退出登录</span>
        <i class="el-icon-arrow-right right-arrow"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      avatarUrl: '' // 可以设置用户头像的URL
    }
  },
  methods: {
    // 处理列表项点击事件
    handleItemClick(item) {
      console.log(`点击了${item}`);
      // 这里可以添加导航逻辑
    },

    // 退出登录
    logout() {
      console.log('退出登录');
      // 这里可以添加退出登录的逻辑
    }
  }
}
</script>

<style scoped>
/* 主容器样式 */
.profile-container {
  width: 100%;
  max-width: none; /* 移除最大宽度限制 */
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1); /* 添加投影提升层次感 */
}

/* 顶部标题栏样式 */
.header {
  height: 50px;
  background-color: #2D8CF0; /* 蓝色标题栏 */
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}

/* 用户信息区域样式 */
.profile-info {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

/* 部门和职位信息样式 */
.info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
}

.info-title {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.info-content {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

/* 中间用户信息区域 */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
}

.user-avatar {
  margin-bottom: 10px;
}

.username {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.team-info {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}

/* 底部列表项样式 */
.list-menu {
  padding: 0 20px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.list-item i:first-child {
  color: #999;
  margin-right: 10px;
}

.list-item span {
  flex: 1;
  color: #333;
}

.right-arrow {
  color: #ccc;
}

/* 按钮点击效果 */
.list-item:hover {
  background-color: #f5f7fa;
  cursor: pointer;
}

@media (min-width: 768px) {
  .profile-info {
    padding: 30px;
  }
  
  .info-section {
    width: 25%;
  }
  
  .user-info {
    width: 50%;
  }
}
</style>