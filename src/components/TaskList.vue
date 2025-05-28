<template>
  <div class="task-list">
    <el-table :data="tasks" style="width: 100%">
      <el-table-column prop="id" label="任务ID"></el-table-column>
      <el-table-column label="分配状态">
        <template slot-scope="{row}">
          <el-tag :type="row.assignedTo ? 'success' : 'warning'">
            {{ row.assignedTo || '未分配' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="进度" width="200">
        <template slot-scope="{row}">
          <el-progress 
            :percentage="row.progress" 
            :status="progressStatus(row)"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="showActions">
        <template slot-scope="{row}">
          <el-select
            v-if="showReassign"
            v-model="selectedMember"
            placeholder="选择组员"
            @change="val => handleReassign(row.id, val)"
          >
            <el-option
              v-for="member in members"
              :key="member"
              :label="member"
              :value="member"
            ></el-option>
          </el-select>
          
          <el-input-number
            v-if="showProgress"
            v-model="currentProgress"
            :min="0"
            :max="100"
            @change="val => updateProgress(row.id, val)"
          ></el-input-number>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TaskList',
  props: {
    tasks: Array,
    showActions: {
      type: Boolean,
      default: false
    },
    showReassign: {
      type: Boolean,
      default: false
    },
    showProgress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedMember: '',
      currentProgress: 0,
      members: ['member1', 'member2', 'member3']
    }
  },
  methods: {
    progressStatus(task) {
      if (task.progress >= 100) return 'success'
      return task.status === 'delayed' ? 'exception' : null
    },
    handleReassign(taskId, member) {
      this.$emit('reassign', { taskId, member })
      this.selectedMember = ''
    },
    updateProgress(taskId, progress) {
      this.$emit('update-progress', { taskId, progress })
      this.currentProgress = 0
    }
  }
}
</script>

<style scoped>
.task-list {
  margin-top: 20px;
}
.el-progress {
  display: inline-block;
  width: 150px;
}
</style>