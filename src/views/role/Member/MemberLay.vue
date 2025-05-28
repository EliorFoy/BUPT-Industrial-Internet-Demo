<template>
  <div class="member-view">
    <el-card class="my-tasks">
      <h3>我的执行任务</h3>
      <el-table :data="myTasks">
        <el-table-column prop="id" label="任务ID"></el-table-column>
        <el-table-column label="任务描述" prop="description"></el-table-column>
        <el-table-column label="进度">
          <template #default="{row}">
            <el-progress 
              :percentage="row.progress" 
              :status="row.progress >= 100 ? 'success' : ''"
            ></el-progress>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  computed: {
    myTasks() {
      return this.$store.getters.userTasks
    }
  }
}
</script>