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
        <div class="header-title">创建任务</div>
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
              <el-select v-model="ruleForm.type" placeholder="请选择任务类型" style="width: 100%;">
                <el-option label="排班任务" value="排班任务"></el-option>
                <el-option label="巡检任务" value="巡检任务"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="任务详情" prop="description">
              <el-input 
                v-model="ruleForm.description" 
                type="textarea" 
                :rows="4"
                placeholder="请输入任务详情"
              ></el-input>
            </el-form-item>
            
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="ruleForm.startTime"
                type="datetime"
                placeholder="请选择任务开始时间"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="ruleForm.endTime"
                type="datetime"
                placeholder="请选择任务结束时间"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            
            <el-form-item label="巡检产线" prop="inspectionLine">
              <el-select v-model="ruleForm.inspectionLine" placeholder="请选择巡检产线" style="width: 100%;">
                <el-option label="黄埔示范线" value="黄埔示范线"></el-option>
                <el-option label="花都新工厂-机加线" value="花都新工厂-机加线"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="负责人员" prop="responsible">
              <el-select v-model="ruleForm.responsible" placeholder="请选择负责人员" style="width: 100%;">
                <el-option label="test-gz1" value="test-gz1"></el-option>
                <el-option label="test-gz2" value="test-gz2"></el-option>
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
        ruleForm: {
          type: '',
          description: '',
          startTime: '',
          endTime: '',
          inspectionLine: '',
          responsible: ''
        },
        rules: {
          type: [
            { required: true, message: '请选择任务类型', trigger: 'change' }
          ],
          description: [
            { required: true, message: '请输入任务详情', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请选择开始时间', trigger: 'change' }
          ],
          endTime: [
            { required: true, message: '请选择结束时间', trigger: 'change' }
          ],
          inspectionLine: [
            { required: true, message: '请选择巡检产线', trigger: 'change' }
          ],
          responsible: [
            { required: true, message: '请选择负责人员', trigger: 'change' }
          ]
        }
      };
    },
    created() {
      // 检查用户权限
      const userRole = localStorage.getItem('userRole');
      if (userRole !== 'supervisor') {
        this.$message.error('您没有权限访问此页面');
        this.$router.push('/home');
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      async submitForm(formName) {
        try {
          const valid = await this.$refs[formName].validate();
          if (!valid) return;

          this.loading = true;
          
          // 生成formId (年月日+6位随机数)
          const now = new Date();
          const formId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
          
          // 构建form数据
          const formData = {
            taskType: this.ruleForm.type,
            taskDetail: this.ruleForm.description,
            taskStartTime: this.ruleForm.startTime.replace(' ', '-'),
            taskEndTime: this.ruleForm.endTime.replace(' ', '-'),
            responseLine: this.ruleForm.inspectionLine,
            responsePerson: this.ruleForm.responsible,
            taskStartTimeDate: new Date(this.ruleForm.startTime).toISOString(),
            taskEndTimeDate: new Date(this.ruleForm.endTime).toISOString(),
            status: 1,
            formId: formId,
            pubPerson: localStorage.getItem('username') || 'test-zg',
            scheduleId: 66,
            groupId: 4
          };

          // 构建URL参数
          const params = new URLSearchParams({
            form: JSON.stringify(formData),
            uid: '1145',
            type: '1145',
            line: this.ruleForm.inspectionLine
          });

          // 发送请求
          const response = await axios.post(`http://10.160.4.92:8018/cloudForm/saveV2?${params.toString()}`);
          
          if (response.data.code === 200 && response.data.ok) {
            this.$message.success('任务创建成功');
            this.$router.push('/tasks');
          } else {
            this.$message.error(response.data.msg || '创建失败');
          }
        } catch (error) {
          console.error('提交失败:', error);
          this.$message.error('创建任务失败，请重试');
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