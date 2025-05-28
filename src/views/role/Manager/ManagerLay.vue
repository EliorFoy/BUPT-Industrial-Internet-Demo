<template>
  <div class="manager-view">
    <el-card class="approve-list">
      <h3>待审核工单</h3>
      <el-table :data="pendingOrders" v-if="pendingOrders.length">
        <el-table-column prop="id" label="工单ID"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button 
              type="success" 
              @click="handleApprove(scope.row.id)"
            >批准</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="暂无待审批工单"></el-empty>
    </el-card>

    <el-card class="task-manage">
      <h3>待分配任务</h3>
      <el-table :data="teamTasks" v-if="teamTasks.length">
        <el-table-column prop="id" label="任务ID"></el-table-column>
        <el-table-column label="关联工单">
          <template #default="scope">
            {{ scope.row.orderId }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button 
              type="primary"
              @click="showAssignDialog(scope.row.id)"
            >分配至班组长</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="所有任务已分配"></el-empty>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['pendingOrders', 'teamTasks'])
  },
  methods: {
    ...mapActions(['approveOrder', 'assignTask']),
    handleApprove(orderId) {
      this.approveOrder(orderId)
        .then(() => this.$message.success('工单已批准，任务已生成'))
        .catch(err => this.$message.error(err.message))
    },
    showAssignDialog(taskId) {
      this.$prompt('请输入班组长ID', '任务分配', {
        inputPattern: /^teamLeader/,
        inputErrorMessage: '必须以teamLeader开头'
      }).then(({ value }) => {
        this.assignTask({ taskId, assignee: value })
        this.$message.success('分配成功')
      })
    }
  }
}
</script>