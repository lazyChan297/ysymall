import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


import orderList from '@/views/orderList/index'
import cashList from '@/views/cashList/index'
import userList from '@/views/userList/index'
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index'),
      meta: {
        title: '登陆'
      }
    },
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/index/index'),
      meta: {
        title: '首页'
      }
    },
    {
      path: '/found',
      name: 'found',
      component: () => import('@/views/found/index'),
      meta: {
        title: '发现'
      }
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/cart/index'),
      meta: {
        title: '购物车'
      }
    },
    {
      path: '/my',
      name: 'my',
      component: () => import('@/views/my/index'),
      meta: {
        title: '我的'
      }
    },
    {
      path: '/goodsDetail/:id',
      name: 'goodsDetail',
      component: () => import('@/views/goodsDetail/index'),
      meta: {
        title: '商品详情'
      }
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('@/views/payment/index'),
      meta: {
        title: '订单结算'
      }
    },
    {
      path: '/publish',
      name: 'publish',
      component: () => import('@/views/publish/index'),
      meta: {
        title: '发布'
      }
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('@/views/order/index'),
      redirect: '/order/index',
      children: [
        {
          path: 'index',
          name: 'index',
          component: orderList,
          meta: {
            title: '全部订单'
          }
        },
        {
          path: 'wait',
          name: 'wait',
          component: orderList,
          meta: {
            title: '待发货'
          }
        },
        {
          path: 'already',
          name: 'already',
          component: orderList,
          meta: {
            title: '已发货'
          }
        },
        {
          path: 'done',
          name: 'done',
          component: orderList,
          meta: {
            title: '已完结'
          }
        }
      ]
    },
    {
      path: '/orderDetail/:id',
      name: 'orderDetail',
      component: () => import('@/views/orderDetail/index'),
      meta: {
        title: '订单详情'
      }
    },
    {
      path: '/express',
      name: 'express',
      component: () => import('@/views/express/index'),
      meta: {
        title: '物流详情'
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('@/views/setting/index'),
      meta: {
        title: '个人设置'
      }
    },
    {
      path: '/bindPhone',
      name: 'bindPhone',
      component: () => import('@/views/bindPhone/index'),
      meta: {
        title: '绑定手机号码'
      }
    },
    {
      path: '/inviter',
      name: 'inviter',
      component: () => import('@/views/inviter/index'),
      meta: {
        title: '修改邀请人'
      }
    },
    {
      path: '/myearnings',
      name: 'earnings',
      component: () => import('@/views/myearnings/index'),
      meta: {
        title: '我的收益'
      }
    },
    {
      path: '/earn',
      name: 'earn',
      component: () => import('@/views/earn/index'),
      meta: {
        title: '全部收益'
      }
    },
    {
      path: '/cash',
      name: 'cash',
      component: () => import('@/views/cash/index'),
      redirect: '/cash/arrival',
      meta: {
        title: '提现记录'
      },
      children: [
        {
          path: 'arrival',
          name: 'arrival',
          component: cashList,
          meta: {
            title: '已到账'
          }
        },
        {
          path: 'non_arrival',
          name: 'non_arrival',
          component: cashList,
          meta: {
            title: '未到账'
          }
        }
      ]
    },
    {
      path: '/cashSuccess/:id',
      name: 'cashSuccess',
      component: () => import('@/views/cashRecord/index'),
      meta: {
        title: '微信零钱到账成功'
      }
    },
    {
      path: '/withdrawal',
      name: 'withdrawal',
      component: () => import('@/views/withdrawal/index'),
      meta: {
        title: '余额提现'
      }
    },
    {
      path: '/QRcode',
      name: 'QRcode',
      component: () => import('@/views/QRcode/index'),
      meta: {
        title: '二维码'
      }
    },
    {
      path: '/friendship',
      name: 'friendship',
      component: () => import('@/views/friendship/index'),
      redirect: '/friendship/inviter',
      children: [
        {
          path: 'inviter',
          name: 'inviter',
          component: userList,
          meta: {
            title: '访客'
          }
        },
        {
          path: 'customer',
          name: 'customer',
          component: userList,
          meta: {
            title: '客户'
          }
        }
      ]
    },
    {
      path: '/userDetail/:id',
      name: 'userDetail',
      component: () => import('@/views/userDetail/index'),
      meta: {
        title: '客户资料'
      }
    },
    {
      path: '/userOrders',
      name: 'userOrders',
      component: () => import('@/views/userOrders/index'),
      meta: {
        title: '客户订单'
      }
    },
    {
      path:'/openList/:level',
      name: 'openList',
      component:()=>import('@/views/openList/index'),
      meta:{
        title: '开通VIP'
      }
    },
    {
      path:'/openRecord',
      name:'openRecord',
      component:()=>import('@/views/openListRecord/index'),
      meta:{
        title: '开通记录'
      }
    },
    {
      path: '/openDetail/:level',
      name: 'openDetail',
      component:()=>import('@/views/openDetail/index'),
      meta:{
        title:'开通VIP'
      }
    },
    {
      path:'/vipLevel',
      name:'vipLevel',
      component:()=>import('@/views/vipLevel/index'),
      meta:{
        title:"升级会员级别"
      }
    },
    {
      path:'/customLevel',
      name:'customLevel',
      component:()=>import('@/views/custom_level/index'),
      meta:{
        title:'设置级别'
      }
    }
  ]
})
