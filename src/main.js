import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './routes'
import Mock from './mock'
import 'font-awesome/css/font-awesome.min.css'
import store from './vuex/store'
import Vuex from 'vuex'
import EleForm from 'vue-ele-form'
import EleFormTreeSelect from 'vue-ele-form-tree-select'
import i18n from './i18n/i18n';
import EleFormImageUploader from 'vue-ele-form-image-uploader';
import "@/styles/index.scss";
import echarts from 'echarts';
import EleFormTableEditor from 'vue-ele-form-table-editor'
import lrz from 'lrz'
import $ from 'jquery'

// 注册 table-editor 组件
Vue.component('table-editor', EleFormTableEditor)

// 注册 tree-select 组件
Vue.component('tree-select', EleFormTreeSelect)
Vue.component('image-uploader', EleFormImageUploader)

// Mock.bootstrap()
Vue.use(ElementUI);
Vue.prototype.$echarts=echarts;
// 注册 ele-form
Vue.use(EleForm, {
  // 专门设置全局的 tree-select 属性
  // 属性参考: https://vue-treeselect.js.org/
  'tree-select': {
    clearable: true // 所有的 tree-select 都会有 clearable = true的属性值
  },
    // 可以在这里设置全局的 image-uploader 属性
    // 'image-uploader': {
    //   action: 'https://jsonplaceholder.typicode.com/posts' // 上传地址
    // }
      // 专门设置全局的 table-editor 属性
  // 属性参考: https://github.com/dream2023/ele-table-editor 或者 下面的属性说明
  'table-editor': {
    isShowDelete: false // 所有的 table-editor 都会有 isShowDelete = false 的属性值, 即不显示删除按钮
  }
})
Vue.use(Vuex)
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.removeItem('user')
  }
  let user = JSON.parse(sessionStorage.getItem('user'))
  if (!user && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')