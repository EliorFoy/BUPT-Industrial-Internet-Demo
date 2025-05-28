<template>
    <div class="create-task-container">
      <div class="page-header">
        <div class="header-left">
          <el-button 
            icon="el-icon-arrow-left" 
            @click="goBack" 
            class="back-button"
            plain
          >返回</el-button>
        </div>
        <div class="header-title">编辑任务</div>
        <div class="header-right"></div>
      </div>

      <div class="page-content">
        <el-card class="form-card">
          <el-form 
            :model="ruleForm" 
            :rules="rules" 
            ref="ruleForm" 
            label-width="100px" 
            class="task-form"
          >
            <el-form-item label="任务类型" prop="type">
              <el-input v-model="ruleForm.type" disabled></el-input>
            </el-form-item>
            
            <el-form-item label="任务详情" prop="description">
              <el-input 
                v-model="ruleForm.description" 
                type="textarea" 
                :rows="4"
                disabled
              ></el-input>
            </el-form-item>
            
            <el-form-item label="开始时间" prop="startTime">
              <el-input v-model="ruleForm.startTime" disabled></el-input>
            </el-form-item>
            
            <el-form-item label="结束时间" prop="endTime">
              <el-input v-model="ruleForm.endTime" disabled></el-input>
            </el-form-item>
            
            <el-form-item label="巡检产线" prop="inspectionLine">
              <el-input v-model="ruleForm.inspectionLine" disabled></el-input>
            </el-form-item>
            
            <el-form-item :label="responsibleLabel" prop="responsible">
              <el-select v-model="ruleForm.responsible" :placeholder="`请选择${responsibleLabel}`" style="width: 100%;">
                <el-option 
                  v-for="option in responsibleOptions" 
                  :key="option.value" 
                  :label="option.label" 
                  :value="option.value">
                </el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item class="form-buttons">
              <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">
                提交
              </el-button>
              <el-button @click="goBack">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        loading: false,
        taskId: null,
        userRole: localStorage.getItem('userRole') || '',
        ruleForm: {
          type: '',
          description: '',
          startTime: '',
          endTime: '',
          inspectionLine: '',
          responsible: ''
        },
        rules: {
          responsible: [
            { required: true, message: '请选择负责人员', trigger: 'change' }
          ]
        }
      };
    },
    computed: {
      responsibleLabel() {
        switch(this.userRole) {
          case 'manager':
            return '负责班组';
          case 'teamLeader':
            return '负责组员';
          default:
            return '负责人员';
        }
      },
      responsibleOptions() {
        switch(this.userRole) {
          case 'manager':
            return [
              { label: 'test-bz1', value: 'test-bz1' },
              { label: 'test-bz2', value: 'test-bz2' }
            ];
          case 'teamLeader':
            return [
              { label: 'test-zy1', value: 'test-zy1' },
              { label: 'test-zy2', value: 'test-zy2' }
            ];
          default:
            return [];
        }
      }
    },
    created() {
      // 检查用户权限
      if (!['manager', 'teamLeader'].includes(this.userRole)) {
        this.$message.error('您没有权限访问此页面');
        this.$router.push('/home');
        return;
      }

      // 获取任务ID
      this.taskId = this.$route.params.taskId;
      if (!this.taskId) {
        this.$message.error('任务ID不存在');
        this.$router.push('/notifications');
        return;
      }

      // 从 localStorage 获取任务数据
      const savedTask = localStorage.getItem('currentTask');
      if (savedTask) {
        try {
          const taskData = JSON.parse(savedTask);
          this.ruleForm = {
            type: taskData.taskType,
            description: taskData.taskDetail,
            startTime: taskData.taskStartTime,
            endTime: taskData.taskEndTime,
            inspectionLine: taskData.responseLine,
            responsible: taskData.responsePerson
          };
          // 清除 localStorage 中的数据
          localStorage.removeItem('currentTask');
        } catch (error) {
          console.error('解析任务数据失败:', error);
          this.fetchTaskData();
        }
      } else {
        // 如果没有本地存储的数据，则从服务器获取
        this.fetchTaskData();
      }
    },
    methods: {
      formatDateToISO(dateStr) {
        try {
          // 处理日期字符串格式
          const date = new Date(dateStr.replace(/-/g, '/'));
          if (isNaN(date.getTime())) {
            console.error('无效的日期格式:', dateStr);
            return null;
          }
          return date.toISOString();
        } catch (error) {
          console.error('日期转换错误:', error);
          return null;
        }
      },
      goBack() {
        this.$router.go(-1);
      },
      async fetchTaskData() {
        try {
          const response = await axios.get(`http://10.160.4.92:8018/cloudForm/getFormById/${this.taskId}`);
          if (response.data.code === 200 && response.data.ok) {
            const taskData = response.data.data;
            this.ruleForm = {
              type: taskData.taskType,
              description: taskData.taskDetail,
              startTime: taskData.taskStartTime,
              endTime: taskData.taskEndTime,
              inspectionLine: taskData.responseLine,
              responsible: taskData.responsePerson
            };
          } else {
            this.$message.error('获取任务数据失败');
            this.$router.push('/notifications');
          }
        } catch (error) {
          console.error('获取任务数据失败:', error);
          this.$message.error('获取任务数据失败');
          this.$router.push('/notifications');
        }
      },
      async submitForm(formName) {
        try {
          const valid = await this.$refs[formName].validate();
          if (!valid) return;

          this.loading = true;
          
          // 构建form数据
          const formData = {
            formId: this.taskId,
            taskType: this.ruleForm.type,
            taskDetail: this.ruleForm.description,
            taskStartTime: this.ruleForm.startTime,
            taskEndTime: this.ruleForm.endTime,
            responseLine: this.ruleForm.inspectionLine,
            taskStartTimeDate: this.ruleForm.startTime ? this.formatDateToISO(this.ruleForm.startTime) : null,
            taskEndTimeDate: this.ruleForm.endTime ? this.formatDateToISO(this.ruleForm.endTime) : null,
            status: this.userRole === 'manager' ? 0 : 2,  // 工长分配后状态为0（待确认人员），班组长确认后状态为2（已确认）
            pubPerson: localStorage.getItem('username') || 'test-zg',
            scheduleId: 66,
            groupId: 4
          };

          // 根据用户角色添加不同的参数
          if (this.userRole === 'manager') {
            formData.responseGroup = this.ruleForm.responsible;
          } else if (this.userRole === 'teamLeader') {
            formData.bindingPerson = this.ruleForm.responsible;
          }

          // 构建URL参数
          const params = new URLSearchParams({
            id: this.taskId,
            form: JSON.stringify(formData),
            group: '1145'
          });

          // 发送请求
          const response = await axios.put(`http://10.160.4.92:8018/cloudForm/updateFormById?${params.toString()}`);
          
          if (response.data.code === 200 && response.data.ok) {
            this.$message.success('任务更新成功');
            this.$router.push('/notifications');
          } else {
            this.$message.error(response.data.msg || '更新失败');
          }
        } catch (error) {
          console.error('提交失败:', error);
          this.$message.error('更新任务失败，请重试');
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .create-task-container {
    min-height: 100vh;
    background-color: #f5f7fa;
    display: flex;
    flex-direction: column;
  }

  .page-header {
    background-color: #fff;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-left {
    width: 80px;
  }

  .header-title {
    font-size: 18px;
    font-weight: 500;
    color: #303133;
  }

  .header-right {
    width: 80px;
  }

  .back-button {
    padding: 8px 15px;
    font-size: 14px;
  }

  .page-content {
    flex: 1;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }

  .form-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .task-form {
    padding: 20px;
  }

  .form-buttons {
    margin-top: 30px;
    text-align: center;
  }

  .form-buttons .el-button {
    min-width: 120px;
    margin: 0 10px;
  }

  .el-form-item {
    margin-bottom: 22px;
  }

  .el-input__inner,
  .el-textarea__inner {
    border-radius: 4px;
  }

  .el-select {
    width: 100%;
  }

  @media screen and (max-width: 768px) {
    .page-content {
      padding: 15px;
    }

    .task-form {
      padding: 15px;
    }

    .form-buttons .el-button {
      min-width: 100px;
    }
  }
  </style>