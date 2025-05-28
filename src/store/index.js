import Vue from 'vue';
import Vuex from 'vuex';
import equipment from './modules/equipment';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    equipment
  }
}); 