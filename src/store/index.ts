import { createStore, Store, useStore as useVuexStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { IRootState } from './types'
import type { IStore } from './types'

// import { getPageList } from '@/service/main/system/system'

import login from './login/login'
import system from './main/system/system'
import systemUser from './main/system/user/index'
import systemRole from './main/system/role/index'
import systemAuthorise from './main/system/authorise/index'
import systemMemberPicker from './main/system/memberPicker/index'
import creationPersonal from './home/creation/personal/index'
import creationPublic from './home/creation/public/index'
import shareFiles from './full-screen/share/files/index'

const store = createStore<IRootState>({
  state() {
    return {
      name: 'admin',
      entireRoles: [],
      entireDepartments: [],
      entireMenus: []
    }
  },
  mutations: {
    changeEntireRoles(state, entireRoles) {
      state.entireRoles = entireRoles
    },
    changeEntireDepartments(state, entireDepartments) {
      state.entireDepartments = entireDepartments
    },
    changeEntireMenus(state, entireMenus) {
      state.entireMenus = entireMenus
    }
  },
  actions: {
    // async getInitalDataAction({ commit }) {
    //   // const { list: entireRoles } = await getPageList('/role/list', { offset: 0, size: 100 })
    //   // const { list: entireDepartments } = await getPageList('/department/list', {
    //   //   offset: 0,
    //   //   size: 100
    //   // })
    //   const { list: entireMenus } = await getPageList('/menu/list', {})
    //   // commit('changeEntireRoles', entireRoles)
    //   // commit('changeEntireDepartments', entireDepartments)
    //   commit('changeEntireMenus', entireMenus)
    // }
  },
  modules: {
    login,
    system,
    systemUser,
    systemRole,
    systemMemberPicker,
    systemAuthorise,
    creationPersonal,
    creationPublic,
    shareFiles
  },
  plugins: [
    //  存储自动补全内容
    createPersistedState({
      key: 'auto-complete',
      paths: ['system', 'login']
    })
  ]
})

// store.state.login.token

export function useStore(): Store<IStore> {
  return useVuexStore()
}

export function setupStore() {
  store.dispatch('system/loadLocalCache')
}

export default store
