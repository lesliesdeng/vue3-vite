import type { Module } from 'vuex'
import type { ILoginState } from './types'
import type { IRootState } from '../types'

import router from '@/router'
import { getPageList } from '@/service/main/system/system'
import { getUserGrant, getUserDetail } from '@/service/login/login'
import localCache from '@/utils/cache'

const login: Module<ILoginState, IRootState> = {
  namespaced: true,
  state() {
    return {
      token: '',
      userInfo: {},
      userMenus: {},
      permissions: [],
      adminGrant: false,
      loginConfig: {}
    }
  },
  getters: {},
  mutations: {
    saveLoginConfig(state, loginConfig: any) {
      state.loginConfig = loginConfig
    },
    saveAdminGrant(state, adminGrant: any) {
      state.adminGrant = adminGrant
    }
  },
  actions: {
    async getLoginConfigAction({ commit }, payload: any) {
      const pageUrl = `${window.location.origin}/oauth/api/v1/setting`
      const data = await getPageList(pageUrl, payload, true, true)
      data.bayWindowConfig = JSON.parse(data.bayWindowConfig)
      data.loginPageConfig = JSON.parse(data.loginPageConfig)
      data.logoConfig = JSON.parse(data.logoConfig)
      console.log(data)
      commit('saveLoginConfig', data)
    },
    // todo手机号登录

    async afterLoginAction({ commit }, { key }) {
      // 1.用户登录
      // const loginResult = await accountLoginRequest(account)
      // const { id, token } = loginResult
      // console.log(id, token)
      // commit('saveToken', token)
      // localCache.setCache('token', token)

      // 获取是否有管理端权限
      const adminGrant = await getUserGrant()
      commit('saveAdminGrant', adminGrant)

      const currentUser = await getUserDetail()
      localCache.setCache('currentUser', currentUser)
      //TODO 先全部跳转学员端首页
      // if (key) {
      //   window.location.replace(
      //     `${window.location.origin}${window.location.pathname}#${decodeURIComponent(key)}`
      //   )
      //   return
      // }
      // 学院端首页
      router.push('/home')
    }
  }
}

export default login
