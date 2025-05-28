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
                    <div class="info-value">100004700060003</div>
                  </div>
                </el-col>
              </el-row>
  
              <div class="sensor-info">
                <div class="info-label">设备详情</div>
                <div class="info-value">该设备提供传感器共有2个，当前传感器提供属性：温度</div>
              </div>
  
              <div class="sensor-type">
                <el-select 
                  v-model="selectedSensor" 
                  placeholder="请选择传感器"
                  size="small"
                  style="width: 100%">
                  <el-option
                    label="接触式温度传感器（温度）"
                    value="temperature">
                  </el-option>
                  <el-option
                    label="振动位移传感器（振动）"
                    value="vibration">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
  
      <el-card>
        <div slot="header" class="clearfix">
          <span>选择时间范围：</span>
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
            <el-tooltip content="导出">
              <el-button icon="el-icon-download" circle></el-button>
            </el-tooltip>
            <el-tooltip content="全屏">
              <el-button icon="el-icon-full-screen" circle></el-button>
            </el-tooltip>
            <el-tooltip content="打印">
              <el-button icon="el-icon-printer" circle></el-button>
            </el-tooltip>
            <el-tooltip content="刷新">
              <el-button icon="el-icon-refresh" circle></el-button>
            </el-tooltip>
          </div>
        </div>
        
        <div>
          <div class="chart-title">{{ selectedSensor === 'temperature' ? '接触式温度传感器' : '振动位移传感器' }}</div>
          <div ref="chart" style="width: 100%; height: 400px; min-height: 400px;"></div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DeviceDetail',
    computed: {
      deviceId() {
        return Number(this.$route.params.id)
      },
      currentDevice() {
        const device = this.$store.getters.getDeviceById(this.deviceId)
        return {
          name: device?.name || this.$route.query.name || '未知设备',
          status: device?.status || this.$route.query.status || '未知状态',
          location: device?.location || this.$route.query.location || '未知位置',
          ...device || {}
        }
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
        selectedSensor: 'temperature'
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
        // 添加 resize 监听
        window.addEventListener('resize', () => {
          this.chartInstance.resize();
        });
      },
      drawChart() {
        // 生成不同传感器的模拟数据
        const generateData = (type) => {
          const times = ['08:00', '08:01', '08:02', '08:03', '08:04', '08:05'];
          return times.map(time => ({
            time,
            value: type === 'temperature' ? 
              Math.round((Math.random() * 0.5 + 24.7) * 100) / 100 :
              Math.round((Math.random() * 0.2 + 0.5) * 100) / 100
          }));
        };
  
        const data = generateData(this.selectedSensor);
        if (this.selectedSensor === 'temperature') {
          data[4].value = 25.1; // 温度异常点
        } else {
          data[3].value = 0.8; // 振动异常点
        }
        const option = {
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              const unit = this.selectedSensor === 'temperature' ? '°C' : 'mm/s²';
              return `${params[0].axisValue}<br/>${params[0].seriesName}: ${params[0].value} ${unit}`;
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: data.map(item => item.time), // 修改此处，使用数据中的time字段
            axisLabel: {
              interval: 0,
              rotate: 0
            }
          },
          yAxis: {
            type: 'value',
            name: this.selectedSensor === 'temperature' ? '温度 (°C)' : '振动 (mm/s²)',
            min: this.selectedSensor === 'temperature' ? 24.7 : 0.4,
            max: this.selectedSensor === 'temperature' ? 25.1 : 0.8
          },
          series: [{
            name: this.selectedSensor === 'temperature' ? '温度' : '振动',
            data: data.map(item => item.value),
            type: 'line',
            symbol: 'circle',
            symbolSize: 10,
            itemStyle: {
              color: function(params) {
                if (params.value > 25) {
                  return '#ff4d4f';
                } else if (params.value < 25) {
                  return '#52c41a';
                } else {
                  return '#faad14';
                }
              }
            },
            lineStyle: {
              width: 2
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(255, 240, 245, 0.5)' // 实际颜色需根据条件调整
                },
                {
                  offset: 1,
                  color: 'rgba(255, 240, 245, 0.1)'
                }
              ])
            },
            markLine: {
              data: [{ yAxis: 25 }],
              lineStyle: {
                type: 'dashed'
              }
            },
            markArea: {
              data: [
                [
                  {
                    yAxis: 25
                  },
                  {
                    yAxis: 25.1
                  }
                ],
                [
                  {
                    yAxis: 24.7
                  },
                  {
                    yAxis: 25
                  }
                ]
              ],
              itemStyle: {
                color: 'rgba(255, 240, 245, 0.1)'
              }
            }
          }]
        };
        
        this.chartInstance.setOption(option);
      }
    },
    watch: {
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
