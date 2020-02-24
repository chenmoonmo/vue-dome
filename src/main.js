import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import treeTbale from 'vue-table-with-tree-grid'

// 配置请求根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// axios拦截器 为所有请求添加请求头的Authorization字段
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 导入并挂载axios
Vue.prototype.$axios = axios

Vue.config.productionTip = false
// 全局注册组件
Vue.component('tree-table', treeTbale)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
