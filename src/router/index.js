import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


import orderList from '@/views/orderList/index'
import cashList from '@/views/cashList/index'
import userList from '@/views/userList/index'
export default new Router({
  routes: [
    {path: '*', redirect: '/index'},
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/views/index/index'),
      meta: {
        title: '缘生源',
        keepAlive:true
      },
      children:[
        {
          path: '/goodsDetail/:id',
          name: 'goodsDetail',
          component: () => import('@/views/goodsDetail/index'),
          meta: {
            title: '缘生源-商品详情'
          }
        }
      ]
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
    // {
    //   path: '/goodsDetail/:id',
    //   name: 'goodsDetail',
    //   component: () => import('@/views/goodsDetail/index'),
    //   meta: {
    //     title: '商品详情'
    //   }
    // },
    {
      path: '/inviteQRcode',
      name:'inviteQRcode',
      component:() => import('@/views/inviteQRcode/index'),
      meta:{
        title:'我的二维码'
      }
    },
    {
      path: '/checkout/onepage/pay/',
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
      path: '/order/:name',
      name: 'order',
      component: () => import('@/views/order/index'),
      // redirect: '/order/index',
      // children: [
      //   {
      //     path: 'all',
      //     name: 'all',
      //     component: orderList,
      //     meta: {
      //       title: '全部订单'
      //     }
      //   },
      //   {
      //     path: 'unshipped',
      //     name: 'unshipped',
      //     component: orderList,
      //     meta: {
      //       title: '待发货'
      //     }
      //   },
      //   {
      //     path: 'shipped',
      //     name: 'shipped',
      //     component: orderList,
      //     meta: {
      //       title: '已发货'
      //     }
      //   },
      //   {
      //     path: 'completed',
      //     name: 'completed',
      //     component: orderList,
      //     meta: {
      //       title: '已完结'
      //     }
      //   }
      // ]
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
      path: '/express/:id',
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
      path: '/inviterList',
      name: 'inviterList',
      component: () => import('@/views/inviterList/index'),
      meta:{
        title: '绑定邀请人'
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
      path:'/agentArea',
      name:'agentArea',
      component:()=> import('@/views/agentArea/index'),
      meta:{
        title: '代理区域'
      }
    },
    {
      path: '/cash',
      name: 'cash',
      component: () => import('@/views/cash/index'),
      // redirect: '/cash/arrival',
      meta: {
        title: '提现记录'
      },
      // children: [
      //   {
      //     path: 'arrival',
      //     name: 'arrival',
      //     component: cashList,
      //     meta: {
      //       title: '已到账'
      //     }
      //   },
      //   {
      //     path: 'non_arrival',
      //     name: 'non_arrival',
      //     component: cashList,
      //     meta: {
      //       title: '未到账'
      //     }
      //   }
      // ]
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
      meta:{
        title:'人脉'
      }
    },
    {
      path:'/second_friendship/:sn',
      name:'second_friendship',
      component: () => import('@/views/secondFriendship/index'),
      meta:{
        title:'二度人脉'
      }
    },
    {
      path: '/userDetail/:sn',
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
      path:'/vipList',
      name: 'vipList',
      component:()=>import('@/views/vipList/index'),
      meta:{
        title: '开通VIP'
      }
    },
    {
      path:'/agentList',
      name: 'agentList',
      component:()=>import('@/views/agentList/index'),
      meta:{
        title: '开通全国总代'
      }
    },
    {
      path:'/openRecord/:type',
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
    // 设置级别列表
    {
      path:'/levelList',
      name:'userLeve',
      component:()=>import('@/views/levelList/index'),
      meta:{
        title:'开通合伙人'
      }
    },
    {
      path:'/chooseLevel/:level',
      name:'chooseLevel',
      component:()=>import('@/views/chooseLevel/index'),
      meta:{
        title:"升级会员级别"
      }
    },
    // 设置界别详情
    {
      path:'/customLevel/:type/:sn',
      name:'customLevel',
      component:()=>import('@/views/custom_level/index'),
      meta:{
        title:'开通合伙人'
      }
    },
    // 编辑代理信息
    {
      path: '/editAgent/:sn',
      name: 'editAgent',
      component: ()=>import('@/views/editAgent/index'),
      meta:{
        title: '编辑合伙人'
      }
    },
    {
      path:'/cardDetail',
      name: 'cardDetail',
      component:()=>import('@/views/cardDetail/index'),
      meta:{
        title: '名片内容'
      }
    },
    //接受邀请
    {
      path: '/inviteConfirm',
      name: 'inviteConfirm',
      component:()=>import('@/views/inviteConfirm/index'),
      meta:{
        title: '缘生源'
      }
    },
    {
      path:'/rank',
      name:'rank',
      component:()=>import('@/views/rank/index'),
      meta:{
        title:'竞赛'
      }
    },
    {
      path:'/applyVip/',
      name:'applyVip',
      component:()=>import('@/views/applyVIP/index'),
      meta:{
        title:'申请VIP'
      }
    },
    {
      path:'/applyAgent/',
      name:'applyAgent',
      component:()=>import('@/views/applyAgent/index'),
      meta:{
        title: '申请总代理'
      }
    },
    {
      path: '/checkAgent',
      name: 'checkAgent',
      component:()=>import('@/views/checkAgent/index'),
      meta:{
        title:'未开通合伙人地区查询'
      }
    }
  ]
})
