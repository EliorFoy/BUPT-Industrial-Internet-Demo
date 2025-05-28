<template>
    <div class="device-detail">
      <el-card class="header">
        <div slot="header" class="clearfix">
          <el-button 
        type="text" 
        icon="el-icon-back" 
        @click="$router.go(-1)"
        style="color: #409EFF; margin-right: 15px; font-size: 16px">
      </el-button>
          <span>设备详情</span>
          <el-button style="float: right; padding: 3px 0" type="text">刷新</el-button>
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="device-info">
              <el-row :gutter="40">
                <el-col :span="6">
                  <div class="info-item">
                    <div class="info-label">设备名称</div>
                    <div class="info-value">{{ currentDevice.name }}</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="info-item">
                    <div class="info-label">设备状态</div>
                    <div class="info-value">{{ currentDevice.status }}</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="info-item">
                    <div class="info-label">设备位置</div>
                    <div class="info-value">{{ currentDevice.location }}</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="info-item">
                    <div class="info-label">传感器ID</div>
                    <div class="info-value">{{ currentDevice.sensorId }}</div>
                  </div>
                </el-col>
              </el-row>
  
              <div class="sensor-info">
                <div class="info-label">设备详情</div>
                <div class="info-value">该设备提供传感器共有{{ currentDevice.sensors ? Object.keys(currentDevice.sensors).length : 0 }}个，当前传感器提供属性：{{ currentDevice.sensors ? Object.keys(currentDevice.sensors).join('、') : '未知' }}</div>
              </div>
  
              <div class="sensor-type">
                <el-select 
                  v-model="selectedSensor" 
                  placeholder="请选择传感器"
                  size="small"
                  style="width: 100%">
                  <el-option
                    v-for="sensor in Object.keys(currentDevice.sensors || {})"
                    :key="sensor"
                    :label="sensor"
                    :value="sensor">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
  
      <el-card>
        <div slot="header" class="clearfix">
          <span>选择时间范围</span>
        </div>
        <el-form :inline="true" :model="timeRangeForm">
          <el-form-item label="日期">
            <el-date-picker
              v-model="timeRangeForm.date"
              type="date"
              format="yyyy/MM/dd"
              value-format="yyyy/MM/dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-time-picker
              v-model="timeRangeForm.startTime"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="选择时间">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-time-picker
              v-model="timeRangeForm.endTime"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="选择时间">
            </el-time-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="drawChart">绘制图表</el-button>
          </el-form-item>
        </el-form>
      </el-card>
  
      <el-card>
        <div slot="header" class="clearfix">
          <span>花都新工厂 - 机加线M3内喷电机</span>
          <div style="float: right;">
            <el-tooltip content="导出数据">
              <el-button icon="el-icon-download" circle></el-button>
            </el-tooltip>
            <el-tooltip content="全屏显示">
              <el-button icon="el-icon-full-screen" circle></el-button>
            </el-tooltip>
            <el-tooltip content="打印图表">
              <el-button icon="el-icon-printer" circle></el-button>
            </el-tooltip>
            <el-tooltip content="刷新数据">
              <el-button icon="el-icon-refresh" circle></el-button>
            </el-tooltip>
          </div>
        </div>
        
        <div>
          <div class="chart-title">{{ selectedSensor }}</div>
          <div ref="chart" style="width: 100%; height: 400px; min-height: 400px;"></div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'DeviceDetail',
    computed: {
      ...mapGetters('equipment', ['getDeviceById']),
      deviceId() {
        return Number(this.$route.params.id);
      },
      currentDevice() {
        return this.getDeviceById(this.deviceId) || {
          name: '未知设备',
          status: '未知状态',
          location: '未知位置',
          sensorId: '未知传感器ID',
          sensors: null
        };
      }
    },
    data() {
      return {
        timeRangeForm: {
          date: '2023/4/13',
          startTime: '08:00',
          endTime: '08:05'
        },
        chartInstance: null,
        selectedSensor: '温度'
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart();
        this.drawChart();
      });
    },
    methods: {
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.chart);
        window.addEventListener('resize', () => {
          this.chartInstance.resize();
        });
      },
      drawChart() {
        // 使用设备传感器数据或生成模拟数据
        const generateData = (type) => {
          const times = ['08:00', '08:01', '08:02', '08:03', '08:04', '08:05'];
          if (this.currentDevice.sensors && this.currentDevice.sensors[type]) {
            return times.map((time, index) => ({
              time,
              value: this.currentDevice.sensors[type][index]
            }));
          }
          return times.map(time => ({
            time,
            value: type === '温度' ? 
              Math.round((Math.random() * 0.5 + 24.7) * 100) / 100 :
              Math.round((Math.random() * 0.2 + 0.5) * 100) / 100
          }));
        };
  
        const data = generateData(this.selectedSensor);
        const isTemperature = this.selectedSensor === '温度';
        
        const option = {
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              const unit = isTemperature ? '°C' : 'mm/s²';
              return `${params[0].axisValue}<br/>${params[0].seriesName}: ${params[0].value} ${unit}`;
            }
          },
          grid: {
            left: '5%',
            right: '5%',
            bottom: '8%',
            top: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: data.map(item => item.time),
            axisLabel: {
              interval: 0,
              rotate: 0,
              color: '#666',
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: '#ddd'
              }
            },
            axisTick: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            name: isTemperature ? '温度 (°C)' : '振动 (mm/s²)',
            nameTextStyle: {
              color: '#666',
              fontSize: 12,
              padding: [0, 0, 0, 40]
            },
            min: isTemperature ? 24 : 0.4,
            max: isTemperature ? 26 : 0.8,
            interval: isTemperature ? 0.5 : 0.1,
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#eee'
              }
            },
            axisLabel: {
              color: '#666',
              fontSize: 12,
              formatter: (value) => {
                return isTemperature ? value.toFixed(1) : value.toFixed(2);
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          series: [{
            name: this.selectedSensor,
            data: data.map(item => item.value),
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: isTemperature ? '#FF6B6B' : '#4ECDC4',
              borderWidth: 2,
              borderColor: '#fff'
            },
            lineStyle: {
              width: 3,
              color: isTemperature ? '#FF6B6B' : '#4ECDC4'
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: isTemperature ? 'rgba(255, 107, 107, 0.3)' : 'rgba(78, 205, 196, 0.3)'
                },
                {
                  offset: 1,
                  color: isTemperature ? 'rgba(255, 107, 107, 0.1)' : 'rgba(78, 205, 196, 0.1)'
                }
              ])
            }
          }]
        };
        
        this.chartInstance.setOption(option);
      }
    },
    watch: {
      currentDevice: {
        immediate: true,
        handler(newDevice) {
          if (newDevice.sensors && Object.keys(newDevice.sensors).length > 0) {
            this.selectedSensor = Object.keys(newDevice.sensors)[0];
          }
        }
      },
      selectedSensor() {
        this.$nextTick(() => {
          this.drawChart();
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .device-detail {
    padding: 10px;
  }
  
  .header {
    margin-bottom: 15px;
  }
  
  .device-info {
    padding: 15px 0;
  }
  
  .info-item {
    padding: 10px 0;
  }
  
  .info-label {
    font-weight: bold;
    color: #606266;
  }
  
  .info-value {
    color: #303133;
    font-size: 14px;
  }
  
  .sensor-info {
    padding: 10px 0;
    border-top: 1px solid #f0f0f0;
    margin-top: 10px;
  }
  
  .type-label {
    font-weight: bold;
    color: #606266;
    float: left;
  }
  
  .type-value {
    color: #303133;
    float: right;
  }
  
  .el-card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
  }
  
  /* 移除原有的float样式 */
  .type-label,
  .type-value {
    float: none;
  }
  
  .sensor-type {
    margin-top: 10px;
  }
  </style>
