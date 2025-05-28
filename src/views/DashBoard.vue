<template>
  <div class="dashboard-container">
    <el-page-header
      title="返回"
      @back="$router.go(-1)"
      :content="roleDisplayName"
    ></el-page-header>
    
    <div class="dashboard-content">
      <h3>欢迎回来，{{ currentUser.username }}</h3>
      <el-button 
        type="danger" 
        @click="handleLogout"
      >退出系统</el-button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.currentUser
    },
    roleDisplayName() {
      const roleMap = {
        supervisor: '设备主管',
        manager: '产线工长',
        teamLeader: '班组长',
        member: '操作组员'
      }
      return roleMap[this.currentUser.role]
    }
  },
  methods: {
    handleLogout() {
      this.$store.commit('CLEAR_USER')
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.dashboard-content {
  margin-top: 40px;
  text-align: center;
}
</style>