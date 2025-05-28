import Vue from 'vue'
import Router from 'vue-router'
import LoginView from '@/views/LoginView.vue'  // 直接导入登录组件

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'  // 确保根路径重定向到登录页
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,  // 使用直接导入的组件
      meta: { public: true }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home/HomePage.vue'),
    },
    {
      path: '/equipment-monitor',
      name: 'equipment-monitor', 
      component: () => import('@/views/Home/Modules/Equipment/EquipmentMonitoring.vue')
    },
    {
      path: '/equipment-monitor/detail/:id',
      name: 'equipment-detail',
      component: () => import('@/views/Home/Modules/Equipment/EquipmentDetail.vue')
    },
    {
      path: '/production-monitor',
      name: 'production-monitor',
      component: () => import('@/views/Home/Modules/Production/ProductionMonitoring.vue')
    },
    {
      path: '/work-order-monitoring',
      name: 'work-order-monitoring',
      component: () => import('@/views/Home/Modules/WorkOrder/WorkOderMonitoring.vue')
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/Task/TaskCalendar.vue')
    },
    {
      path: '/create-task',
      name: 'create-task',
      component: () => import('@/views/Task/CreateTask.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/task-detail/:taskId',
      name: 'TaskDetail',
      component: () => import('@/views/Task/Taskdetail.vue')
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('@/views/Notification.vue')
    },
    {
      path: '/profile',
      name: 'profile',  // 修改路由名称
      component: () => import('@/views/Profile.vue')
    },
    {
      path: '/supervisor',
      name: 'Supervisor',
      component: () => import('@/views/role/Supervisor/SupervisorLay.vue')
    },
    {
      path: '/manager',
      name: 'Manager',
      component: () => import('@/views/role/Manager/ManagerLay.vue')
    },
    {
      path: '/team-leader',
      name: 'TeamLeader',
      component: () => import('@/views/role/TeamLeader/TeamLeaderLay.vue')
    },
    {
      path: '/member',
      name: 'Member',
      component: () => import('@/views/role/Member/MemberLay.vue')
    },
    { 
      path: '*',
      redirect: '/login'
    }
  ]
})

// 修复重复导航问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err
  })
}

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userToken')
  
  // 如果是访问登录页，直接放行
  if (to.path === '/login') {
    next()
    return
  }
  
  // 如果未登录且访问的不是登录页，重定向到登录页
  if (!isAuthenticated) {
    next('/login')
    return
  }
  
  // 其他情况正常放行
  next()
})

export default router