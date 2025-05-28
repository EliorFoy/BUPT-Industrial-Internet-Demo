<template>
  <div class="team-leader-view">
    <el-card class="task-list">
      <h3>待分配任务</h3>
      <el-table :data="teamTasks" v-if="teamTasks.length">
        <el-table-column prop="id" label="任务ID"></el-table-column>
        <el-table-column label="当前状态">
          <template #default="scope">
            <el-tag type="warning">待分配至组员</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-select 
              v-model="selectedMember" 
              placeholder="选择组员"
              @change="val => assignToMember(scope.row.id, val)"
            >
              <el-option
                v-for="m in ['member']"
                :key="m"
                :label="m"
                :value="m"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="当前没有待分配任务"></el-empty>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      selectedMember: ''
    }
  },
  computed: {
    ...mapGetters(['teamTasks'])
  },
  methods: {
    ...mapActions(['assignTask']),
    assignToMember(taskId, member) {
      this.assignTask({ taskId, assignee: member })
      this.$message.success(`任务 ${taskId} 已分配给 ${member}`)
      this.selectedMember = ''
    }
  }
}
</script>

<style scoped>
.team-leader-view {
  padding: 20px;
}
</style>