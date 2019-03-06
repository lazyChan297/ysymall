import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const state = {
    userInfo:{}
}

const SAVE_USERINFO = 'SAVE_USERINFO'

const mutations = {
    [SAVE_USERINFO](state,userInfo) {
        state.userInfo = userInfo
    }
}

const getters = {
    userInfo: (state) => state.userInfo
}

export default new Vuex.Store({
    state,
    mutations,
    getters
})