import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts;

Vue.prototype.$ELEMENT = { size: 'medium' }
Vue.use(ElementUI)

// 全局错误处理
Vue.config.errorHandler = (err, vm, info) => {
  const ignoredErrors = ['NavigationDuplicated']
  if (!ignoredErrors.includes(err.name)) {
    console.error(`[Global Error] ${err.toString()}\nInfo: ${info}`)
  }
}

// 路由重复导航处理
const originalPush = router.constructor.prototype.push
router.constructor.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err
  })
}

// 初始化Vue实例
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')