import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const state = {
    userInfo:{},
    cartInfo:{}
}

const SAVE_USERINFO = 'SAVE_USERINFO'
const SAVE_CARTINFO = 'SAVE_CARTINFO'
const CART_LEN = 'CART_LEN'

const mutations = {
    [SAVE_USERINFO](state,userInfo) {
        state.userInfo = userInfo
    },
    [SAVE_CARTINFO] (state, cart) {
        state.cartInfo = cart
    }
}

const getters = {
    userInfo: (state) => state.userInfo,
    cartInfo: (state) => state.cartInfo
}

const actions = {
    saveCartInfo({commit},cartInfo){
        commit('SAVE_CARTINFO',cartInfo)
    }
}

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions
})