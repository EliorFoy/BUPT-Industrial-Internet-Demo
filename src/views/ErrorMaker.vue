<template>
  <div class="error-container">
    <el-result
      title="404"
      sub-title="资源未找到"
    >
      <template #icon>
        <el-image :src="require('@/assets/403.png')"></el-image>
      </template>
      <template #extra>
        <el-button 
          type="primary"
          @click="$router.push('/login')"
        >返回登录</el-button>
      </template>
    </el-result>
  </div>
</template>

<script>
export default {
  name: 'ErrorMaker',
  mounted() {
    this.$notify.error({
      title: '路径错误',
      message: '请求的页面不存在',
      duration: 0
    });
  }
}
</script>

<style scoped>
.error-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}
</style>