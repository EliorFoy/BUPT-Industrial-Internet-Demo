const state = {
  devices: [
    {
      id: 1,
      image: 'https://via.placeholder.com/80x60',
      location: '花都新工厂',
      name: '机加线M3内喷电机',
      status: '正常',
      sensorId: 'SENSOR001',
      sensors: {
        温度: [24.8, 24.9, 25.0, 25.1, 25.0, 24.9],
        振动: [0.52, 0.53, 0.51, 0.52, 0.53, 0.52]
      }
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/80x60',
      location: '花都新工厂', 
      name: '机加线工控机柜',
      status: '正常',
      sensorId: 'SENSOR002',
      sensors: {
        温度: [25.2, 25.3, 25.2, 25.1, 25.2, 25.3],
        振动: [0.48, 0.49, 0.48, 0.47, 0.48, 0.49]
      }
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/80x60',
      location: '花都新工厂',
      name: '机加线M5内喷电机',
      status: '正常',
      sensorId: 'SENSOR003',
      sensors: {
        温度: [24.7, 24.8, 24.9, 24.8, 24.7, 24.8],
        振动: [0.51, 0.52, 0.51, 0.50, 0.51, 0.52]
      }
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/80x60',
      location: '黄埔示范线',
      name: '涂装线机器人手臂',
      status: '正常',
      sensorId: 'SENSOR004',
      sensors: {
        温度: [25.5, 25.6, 25.5, 25.4, 25.5, 25.6],
        振动: [0.55, 0.56, 0.55, 0.54, 0.55, 0.56]
      }
    },
    {
      id: 5, 
      image: 'https://via.placeholder.com/80x60',
      location: '黄埔示范线',
      name: '总装线传送带',
      status: '异常',
      sensorId: 'SENSOR005',
      sensors: {
        温度: [26.8, 26.9, 27.0, 27.1, 27.2, 27.3],
        振动: [0.75, 0.76, 0.77, 0.78, 0.79, 0.80]
      }
    },
    {
      id: 6,
      image: 'https://via.placeholder.com/80x60',
      location: '花都新工厂',
      name: '焊接工作站',
      status: '异常',
      sensorId: 'SENSOR006',
      sensors: {
        温度: [27.2, 27.3, 27.4, 27.5, 27.6, 27.7],
        振动: [0.82, 0.83, 0.84, 0.85, 0.86, 0.87]
      }
    }
  ]
};

const getters = {
  getAllDevices: state => state.devices,
  getDeviceById: state => id => state.devices.find(device => device.id === id),
  getDevicesByLocation: state => location => {
    if (location === 'all') return state.devices;
    return state.devices.filter(device => device.location === location);
  },
  getDeviceStats: state => {
    const total = state.devices.length;
    const normal = state.devices.filter(device => device.status === '正常').length;
    const abnormal = state.devices.filter(device => device.status === '异常').length;
    return { total, normal, abnormal };
  }
};

const mutations = {
  updateDeviceStatus(state, { id, status }) {
    const device = state.devices.find(d => d.id === id);
    if (device) {
      device.status = status;
    }
  }
};

const actions = {
  updateDeviceStatus({ commit }, payload) {
    commit('updateDeviceStatus', payload);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}; 