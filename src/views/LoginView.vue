<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">工业工单系统</h2>
      
      <el-form 
        ref="loginForm"
        :model="form"
        :rules="rules"
        @submit.native.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <el-button
          type="primary"
          native-type="submit"
          class="login-btn"
          :loading="loading"
        >立即登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleLogin() {
      try {
        const isValid = await this.$refs.loginForm.validate()
        if (!isValid) return

        this.loading = true
        
        // 模拟登录请求
        const roleMap = {
          'test-zg': '/supervisor',
          'test-gz1': '/manager',
          'test-bz1': '/team-leader',
          'test-zy1': '/member'
        }
        const roleName = {
          'test-zg': 'supervisor',
          'test-gz1': 'manager',
          'test-bz1': 'teamLeader',
          'test-zy1': 'member'
        }

        if (this.form.password === '123456' && roleMap[this.form.username]) {
          // 清除旧的用户信息
          localStorage.clear()
          
          // 设置新的用户信息
          localStorage.setItem('userToken', 'demo-token')
          localStorage.setItem('userRole', roleName[this.form.username])
          localStorage.setItem('username', this.form.username)
          
          // 触发全局事件，通知其他组件用户信息已更新
          this.$root.$emit('user-role-changed', roleName[this.form.username])
          
          // 等待一下确保状态更新完成
          await this.$nextTick()
          
          // 统一导航到 HomePage
          await this.$router.push('/home')
        } else {
          this.$message.error('用户名或密码错误')
        }
      } catch (error) {
        console.error('登录错误:', error)
        this.$message.error('登录失败，请重试')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #409EFF;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
}
</style>