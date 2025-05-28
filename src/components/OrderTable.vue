<template>
  <el-table :data="orders" style="width: 100%">
    <el-table-column prop="id" label="工单ID" width="180"></el-table-column>
    <el-table-column prop="type" label="类型" width="120">
      <template slot-scope="{row}">
        {{ typeMap[row.type] || row.type }}
      </template>
    </el-table-column>
    <el-table-column prop="creator" label="创建人"></el-table-column>
    <el-table-column label="状态">
      <template slot-scope="{row}">
        <el-tag :type="statusColor[row.status]">
          {{ statusMap[row.status] || row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="showActions">
      <template slot-scope="{row}">
        <el-button
          v-for="action in getActions(row.status)"
          :key="action"
          :type="actionTypes[action]"
          size="mini"
          @click="handleAction(row.id, action)"
        >
          {{ actionLabels[action] }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'OrderTable',
  props: {
    orders: Array,
    showActions: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      typeMap: {
        repair: '设备维修',
        maintain: '定期维护'
      },
      statusMap: {
        pending: '待审核',
        approved: '已批准',
        rejected: '已驳回'
      },
      statusColor: {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger'
      },
      actionLabels: {
        approve: '批准',
        reject: '驳回',
        assign: '分配'
      },
      actionTypes: {
        approve: 'success',
        reject: 'danger',
        assign: 'primary'
      }
    }
  },
  methods: {
    getActions(status) {
      const actionMap = {
        pending: ['approve', 'reject'],
        approved: ['assign']
      }
      return actionMap[status] || []
    },
    handleAction(orderId, action) {
      this.$emit(action, orderId)
    }
  }
}
</script>