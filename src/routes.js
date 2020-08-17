import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/login',
      component: () => import('./views/Login.vue'),
      name: '',
      hidden: true
    },
    {
      path: '/404',
      component: () => import('./views/404.vue'),
      name: '',
      hidden: true
    },
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      // menucode: 'home',
      hidden: true,
      children: [{
        path: '/home',
        component: () => import('./views/dashboard/dashboard.vue'),
        name: 'home'
      }]
    },
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      name: 'menu.biaodantianxie',
      iconCls: 'fa el-icon-s-order',
      leaf: true,
      menucode: 'liudiaobiao',
      children: [{
          path: '/liudiaobiao',
          component: () => import('./views/nav3/Form.vue'),
          name: 'menu.biaodantianxie'
        },
        {
          path: '/tableYouke',
          component: () => import('./views/nav3/Table.vue'),
          name: 'tableYouke'
        }
      ]
    },
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      name: 'menu.jilu',
      redirect: {
        path: '/formRecord'
      },
      iconCls: 'fa fa-address-card',
      leaf: true,
      menucode: 'formRecord',
      children: [{
        path: '/formRecord',
        component: () => import('./views/nav1/Form_haiguan.vue'),
        name: 'menu.wenxunjilu',
        children: [{
            path: 'tableRecord_edit',
            component: () => import('./views/nav1/Table_haiguan_edit.vue'),
            name: 'menu.wenxunjilu'
          },
          {
            path: 'tableRecord',
            component: () => import('./views/nav1/Table_haiguan.vue'),
            name: 'menu.biaodanxiangqing'
          }
        ]
      }]
    },
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      name: 'menu.biaodan',
      iconCls: 'fa el-icon-s-claim',
      leaf: true,
      menucode: 'form',
      children: [{
        path: '/form',
        component: () => import('./views/nav2/forms.vue'),
        name: 'menu.biaodanguanli',
        children: [{
            path: 'tableView',
            hidden: true,
            component: () => import('./views/nav2/Table_view.vue'),
            name: 'menu.yulan'
          },
          {
            path: 'tableView1',
            hidden: true,
            component: () => import('./views/nav2/Table_view1.vue'),
            name: 'menu.yulan'
          }
        ]
      }]
    },
    // new通关记录查询
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      name: 'menu.tongguanjilu',
      iconCls: 'fa el-icon-s-grid',
      leaf: true,
      menucode: 'clearance',
      children: [{
        path: '/clearance',
        component: () => import('./views/clearance/clearance.vue'),
        name: 'menu.tongguanjilu',
        children: [{
          path: 'clearanceDetail',
          component: () => import('./views/clearance/clearanceDetail.vue'),
          name: 'menu.wenxunjilu'
        }, {
          path: '/clearanceDetail',
          component: () => import('./views/clearance/clearanceDetail.vue'),
          name: 'menu.wenxunjilu'
        }
        , {
          path: '/shenmingka',
          component: () => import('./views/clearance/shenmingka.vue'),
          name: 'shenmingka'
        }]
      }]
    },
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      name: 'menu.guanyuanliebiao',
      iconCls: 'fa el-icon-s-custom',
      leaf: true,
      menucode: 'officers',
      children: [{
        path: '/officers',
        component: () => import('./views/nav2/officers.vue'),
        name: 'menu.guanyuanliebiao'
      }]
    },

    {
      path: '/',
      component: () => import('./views/Home.vue'),
      name: 'menu.guanquliebiao',
      iconCls: 'fa el-icon-menu',
      leaf: true,
      menucode: 'customers',
      children: [{
        path: '/customers',
        component: () => import('./views/nav2/customers.vue'),
        name: 'menu.guanquliebiao'
      }]
    },
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      name: '',
      iconCls: 'fa el-icon-notebook-2',
      leaf: true,
      menucode: 'task',
      children: [{
          path: '/task',
          hidden: true,
          component: () => import('./views/nav2/caiyang.vue'),
          name: 'menu.caiyangliebiao'
        },
        {
          path: '/taskDetail',
          hidden: true,
          component: () => import('./views/nav2/caiyangDetail.vue'),
          name: 'menu.caiyangliebiao'
        },
        {
          path: '/taskJudge',
          hidden: true,
          component: () => import('./views/nav2/panding.vue'),
          name: 'menu.pandingliebiao'
        },
        {
          path: '/taskJudgeDetail',
          hidden: true,
          component: () => import('./views/nav2/pandingDetail.vue'),
          name: 'menu.pandingliebiao'
        },
        {
          path: '/taskHealth',
          hidden: true,
          component: () => import('./views/nav2/jiankang.vue'),
          name: 'menu.jiankangliebiao'
        },
        {
          path: '/taskHealthDetail',
          hidden: true,
          component: () => import('./views/nav2/jiankangDetail.vue'),
          name: 'menu.jiankangliebiao'
        }
      ]
    },
    //new送检处理
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      name: 'menu.inspection',
      iconCls: 'fa el-icon-s-cooperation',
      leaf: true,
      menucode: "inspection", //
      children: [{
        path: '/inspection',
        component: () => import('./views/inspection/inspection.vue'),
        name: 'menu.inspection',
      },
      {
        path: '/inspectionStatic',
        component: () => import('./views/inspection/inspectionStatic.vue'),
        name:"送检统计"
      }]
    },
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      name: 'menu.roleManager',
      iconCls: 'fa el-icon-user-solid',
      leaf: true,
      menucode: 'roleManager', //
      children: [{
        path: '/roleManager',
        component: () => import('./views/roleManage/roleManage.vue'),
        name: 'menu.roleManage'
      }]
    }, 
    //new操作记录
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      name: 'menu.operationRecord',
      iconCls: 'fa el-icon-s-comment',
      leaf: true,
      // menucode: 'operationRecord', 
      menucode: 'operationaRecord', //
      children: [{
        path: '/operationaRecord',
        component: () => import('./views/operationRecord/operationRecord.vue'),
        name: 'menu.operationRecord'
      }]
    },
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      name: 'menu.yichangchuli',
      iconCls: 'fa el-icon-s-release',
      leaf: true,
      menucode: 'exception',
      children: [{
        path: '/exception',
        component: () => import('./views/abnormalForm/abnormalForm.vue'),
        name: 'menu.yichangchuli'
      }]
    },
  //   //new拦截旅客处理
  //   {
  //     path: '/',
  //     component: () => import('./views/Home.vue'),
  //     name: 'menu.lanjiechuli',
  //     iconCls: 'fa el-icon-s-release',
  //     leaf: true,
  //     menucode: 'intercept',
  //     children: [{
  //       path: '/intercept',
  //       component: () => import('./views/intercept/intercept.vue'),
  //       name: 'menu.lanjiechuli'
  //     }]
  //   },
  //  //new系统设置
  //   {
  //     path: '/',
  //     component: () => import('./views/Home.vue'),
  //     name: 'menu.xitongshezhi',
  //     iconCls: 'fa el-icon-s-release',
  //     leaf: true,
  //     menucode: 'systemSetting',
  //     children: [{
  //       path: '/systemSetting',
  //       component: () => import('./views/systemSetting/systemSetting.vue'),
  //       name: 'menu.xitongshezhi'
  //     }]
  //   },
    {
      path: '*',
      hidden: true,
      redirect: {
        path: '/404'
      }
    }
  ]
})