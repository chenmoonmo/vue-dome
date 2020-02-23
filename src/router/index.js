import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'

Vue.use(VueRouter)

const routes = [
  // 路由重定向
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    // 路由重定向到子组件
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/rights', component: rights },
      { path: '/roles', component: roles }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 配置路由导航守卫
router.beforeEach((to, from, next) => {
  // to表示要访问的路径
  // from表示从哪个路径跳转而来
  // next 是一个函数 表示放行
  // 1.next() 放行 2.next('path') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
