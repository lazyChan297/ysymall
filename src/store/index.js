import Vue from 'vue';
import Vuex from 'vuex';
// 状态每次改变都会在控制台打印
import createLogger from 'vuex/dist/logger'

const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)

const state = {
    userInfo:{},
    cartInfo:{},
    cartLen:'',
    current_customer:{},
    inviteInfo:{}
}

const SAVE_USERINFO = 'SAVE_USERINFO'
const SAVE_CARTINFO = 'SAVE_CARTINFO'
const SAVE_CARTLEN = 'SAVE_CARTLEN'
const SAVE_CURRENT_CUSTOMER = 'SAVE_CURRENT_CUSTOMER'
const SAVE_INVITEINFO = 'SAVE_INVITEINFO'

const mutations = {
    [SAVE_USERINFO](state,userInfo) {
        state.userInfo = userInfo
    },
    [SAVE_CARTLEN](state,len) {
        state.cartLen = len
    },
    [SAVE_CURRENT_CUSTOMER](state,current_customer){
        state.current_customer = current_customer
    },
    [SAVE_INVITEINFO](state,inviteInfo) {
        state.inviteInfo = inviteInfo
    }
}

const getters = {
    userInfo: (state) => state.userInfo,
    cartInfo: (state) => state.cartInfo,
    cartLen: (state) => state.cartLen,
    current_customer:(state) => state.current_customer,
    inviteInfo:(state)=> state.inviteInfo 
}



export default new Vuex.Store({
    state,
    mutations,
    getters,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})