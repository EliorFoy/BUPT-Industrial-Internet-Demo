<template>
    <div class="production-line">
      <el-card class="header-card">
        <div slot="header" class="clearfix">
          <el-button 
            type="text" 
            icon="el-icon-back" 
            @click="$router.go(-1)"
            style="margin-right: 15px; font-size: 16px">
          </el-button>
          <span>产线选择</span>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-more"></el-button>
        </div>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="产线" name="first"></el-tab-pane>
          <el-tab-pane label="北邮-轴承" name="second"></el-tab-pane>
        </el-tabs>
      </el-card>
  
      <el-card class="status-card">
        <div slot="header" class="clearfix">
          <span>产线状态图</span>
        </div>
        <el-row>
          <el-col :span="12">
            <div ref="pieChart" style="width: 100%; height: 300px;"></div>
          </el-col>
          <el-col :span="12">
            <div class="status-numbers">
              <div class="status-item">
                <div class="status-label">超时</div>
                <div class="status-value overtime">2</div>
              </div>
              <div class="status-item">
                <div class="status-label">缓慢</div>
                <div class="status-value slow">4</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
  
      <el-card class="lines-card">
        <div class="line-item normal">
          <div class="icon-container">
            <svg-icon icon-class="normal" class="icon-normal"></svg-icon>
          </div>
          <div class="line-names">
            <div>产线一</div>
            <div>产线五</div>
            <div>产线九</div>
            <div>产线十</div>
          </div>
          <div class="line-status">
            <div>缓慢状态</div>
            <div>缓慢状态</div>
            <div>缓慢状态</div>
            <div>缓慢状态</div>
          </div>
        </div>
  
        <div class="line-item overtime">
          <div class="icon-container">
            <svg-icon icon-class="overtime" class="icon-overtime"></svg-icon>
          </div>
          <div class="line-names">
            <div>产线二</div>
            <div>产线六</div>
          </div>
          <div class="line-status">
            <div>超时状态</div>
            <div>超时状态</div>
          </div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts'; // 修正导入方式
  
  export default {
    data() {
      return {
        activeTab: 'first',
        chartData: [
          { value: 10, name: '正常', itemStyle: { color: '#1890ff' } },
          { value: 2, name: '超时', itemStyle: { color: '#fa8c16' } },
          { value: 4, name: '缓慢', itemStyle: { color: '#13c2c2' } },  // 修改颜色值
          { value: 1, name: '故障', itemStyle: { color: '#ff4d4f' } },
          { value: 0, name: '停产', itemStyle: { color: '#d9d9d9' } }
        ],
      };
    },
    mounted() {
      this.initPieChart();
    },
    beforeDestroy() {
      if (this.pieChart) {
        this.pieChart.dispose();
      }
    },
    methods: {
      initPieChart() {
        this.$nextTick(() => {
          this.pieChart = echarts.init(this.$refs.pieChart); // 使用正确导入的echarts
          const option = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              right: 10,
              top: 'center',
              data: ['正常', '超时', '缓慢', '故障', '停产']
            },
            series: [{
              type: 'pie',
              data: this.chartData,
              radius: '55%',
              center: ['40%', '50%'],
              label: {
                show: true,
                formatter: '{b}: {d}%'
              }
              // 移除itemStyle配置，直接使用数据项中的颜色
            }]
          };
          this.pieChart.setOption(option);
        });
        window.addEventListener('resize', () => {
          if (this.pieChart) this.pieChart.resize();
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .production-line {
    padding: 10px;
  }
  
  .header-card {
    margin-bottom: 15px;
  }
  
  .status-card {
    margin-bottom: 15px;
  }
  
  .status-numbers {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
  }
  
  .status-item {
    text-align: center;
  }
  
  .status-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 10px;
  }
  
  .status-value {
    font-size: 24px;
    font-weight: bold;
  }
  
  .overtime {
    color: #fa8c16;
  }
  
  .slow {
    color: #1890ff;
  }
  
  .lines-card {
    padding: 0;
  }
  
  .line-item {
    display: flex;
    align-items: center;
    padding: 20px;
    margin-bottom: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background-color: #fff;
  }
  
  .line-item.normal {
    border-color: #e6f7ff;
    background-color: #f0f9ff;
  }
  
  .line-item.overtime {
    border-color: #fff7e6;
    background-color: #fffbe6;
  }
  
  .icon-container {
    margin-right: 20px;
  }
  
  .line-names {
    flex-grow: 1;
    margin-right: 20px;
  }
  
  .line-status {
    flex-grow: 1;
    text-align: right;
  }
  
  .icon-normal {
    color: #1890ff;
    font-size: 40px;
  }
  
  .icon-overtime {
    color: #fa8c16;
    font-size: 40px;
  }
  </style>