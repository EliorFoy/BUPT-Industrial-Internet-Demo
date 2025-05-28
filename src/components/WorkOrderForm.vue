<template>
  <el-form :model="form" label-width="80px" @submit.native.prevent="handleSubmit">
    <el-form-item label="工单类型" required>
      <el-select v-model="form.type" placeholder="请选择类型">
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="设备列表" required>
      <el-checkbox-group v-model="form.devices">
        <el-checkbox 
          v-for="device in deviceList" 
          :key="device.id" 
          :label="device.name"
        ></el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="问题描述">
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入详细描述"
        v-model="form.description">
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" native-type="submit">提交工单</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'WorkOrderForm',
  data() {
    return {
      form: {
        type: '',
        devices: [],
        description: ''
      },
      typeOptions: [
        { value: 'repair', label: '设备维修' },
        { value: 'maintain', label: '定期维护' }
      ],
      deviceList: [
        { id: 'DEV-001', name: '数控机床A' },
        { id: 'DEV-002', name: '激光切割机B' }
      ]
    }
  },
  methods: {
    handleSubmit() {
      if (!this.form.type || this.form.devices.length === 0) {
        this.$message.error('请填写完整信息')
        return
      }
      this.$emit('submit', this.form)
      this.form = { type: '', devices: [], description: '' }
    }
  }
}
</script>