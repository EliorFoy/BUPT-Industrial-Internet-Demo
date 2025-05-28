<template>
  <div class="supervisor-view">
    <el-card class="create-order">
      <h3>新建工单（增强版）</h3>
      <el-form ref="form" :model="form" label-width="120px">
        <!-- 工单类型 -->
        <el-form-item label="工单类型" prop="type" required>
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option
              v-for="t in orderTypes"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            />
          </el-select>
        </el-form-item>

        <!-- 设备选择 -->
        <el-form-item label="关联设备" prop="devices" required>
          <device-selector 
            v-model="form.devices"
            :devices="devices"
          />
        </el-form-item>

        <!-- 紧急程度 -->
        <el-form-item label="紧急程度" prop="priority">
          <el-rate
            v-model="form.priority"
            :max="3"
            :texts="['普通', '重要', '紧急']"
            show-text
          />
        </el-form-item>

        <!-- 问题描述 -->
        <el-form-item label="问题描述" prop="description" required>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请详细描述问题现象"
            v-model="form.description"
            resize="none"
          />
        </el-form-item>

        <!-- 附件上传 -->
        <el-form-item label="现场照片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="submitForm"
            :loading="submitting"
          >提交工单</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 全局状态看板 -->
    <el-card class="status-board">
      <h3>全局工单状态</h3>
      <el-row :gutter="20">
        <el-col :span="8">
          <status-card 
            title="待处理工单"
            :count="pendingOrders.length"
            type="warning"
          />
        </el-col>
        <el-col :span="8">
          <status-card 
            title="进行中任务"
            :count="tasksInProgress"
            type="primary"
          />
        </el-col>
        <el-col :span="8">
          <status-card 
            title="已完成任务"
            :count="completedTasks"
            type="success"
          />
        </el-col>
      </el-row>
      
      <el-table 
        :data="workOrders" 
        style="width: 100%"
        @row-click="showOrderDetail"
      >
        <el-table-column prop="id" label="工单ID" width="180" />
        <el-table-column label="类型" width="120">
          <template slot-scope="{row}">
            {{ typeMap[row.type] || row.type }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{row}">
            <el-tag :type="statusColor[row.status]">
              {{ statusMap[row.status] || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import DeviceSelector from '@/components/DeviceSelector'
import StatusCard from '@/components/StatusCard'

export default {
  components: { DeviceSelector, StatusCard },
  data() {
    return {
      submitting: false,
      form: {
        type: '',
        devices: [],
        priority: 1,
        description: '',
        attachments: []
      },
      orderTypes: [
        { value: 'repair', label: '设备维修' },
        { value: 'maintain', label: '定期维护' },
        { value: 'upgrade', label: '系统升级' }
      ],
      typeMap: {
        repair: '维修',
        maintain: '维护',
        upgrade: '升级'
      },
      statusMap: {
        pending: '待审批',
        approved: '已批准',
        rejected: '已驳回'
      },
      statusColor: {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger'
      }
    }
  },
  computed: {
    ...mapState(['workOrders', 'devices']),
    ...mapGetters(['pendingOrders']),
    tasksInProgress() {
      return this.$store.state.tasks.filter(t => t.status === 'in-progress').length
    },
    completedTasks() {
      return this.$store.state.tasks.filter(t => t.status === 'completed').length
    }
  },
  methods: {
    ...mapActions(['createOrder']),
    handleUpload(file) {
      this.form.attachments.push(file)
    },
    submitForm() {
      this.submitting = true
      this.createOrder(this.form)
        .then(() => {
          this.$message.success('工单创建成功')
          this.resetForm()
        })
        .catch(err => this.$message.error(err.message))
        .finally(() => this.submitting = false)
    },
    resetForm() {
      this.form = {
        type: '',
        devices: [],
        priority: 1,
        description: '',
        attachments: []
      }
      this.$refs.form.resetFields()
    },
    showOrderDetail(order) {
      this.$router.push(`/order/${order.id}`)
    }
  }
}
</script>

<style scoped>
.status-board {
  margin-top: 2rem;
}
</style>