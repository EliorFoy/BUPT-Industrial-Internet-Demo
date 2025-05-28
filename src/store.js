import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    devices: [],
    workOrders: [],
    tasks: [],
    currentDevice: null
  },
  mutations: {
    SET_DEVICES(state, devices) {
      state.devices = devices
    },
    SET_CURRENT_DEVICE(state, device) {
      state.currentDevice = device
    }
  },
  getters: {
    getDeviceById: (state) => (id) => {
      return state.devices.find(device => device.id === id)
    }
  },
  actions: {
    initDevices({ commit }, devices) {
      commit('SET_DEVICES', devices)
    },
    setCurrentDevice({ commit }, device) {
      commit('SET_CURRENT_DEVICE', device)
    }
  },
  plugins: [createPersistedState()]
}) 