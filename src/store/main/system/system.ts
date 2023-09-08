import { Module } from 'vuex'
import { ISystemState, IPagePayload } from './types'
import { IRootState } from '../../types'
import Service from '@/global/common'
import router from '@/router'
import { menuMapToRoutes } from '@/utils/map-menu'
import localCache from '@/utils/cache'

import {
  getPageList,
  deletePageData,
  newPageData,
  editPageData,
  uploadPageData,
  pageDownlod
} from '@/service/main/system/system'

const systemModule: Module<ISystemState, IRootState> = {
  namespaced: true,
  state() {
    return {
      departmentTotalCount: 0,
      departmentList: [],
      roleTotalCount: 0,
      roleList: [],
      menuList: [],
      autoComplete: {},
      userMenus: [],
      userGrade: {},
      token: {},
      userInfo: {}
    }
  },
  mutations: {
    // 查询全部组织架构；目前未使用
    changeDepartmentTotalCount(state, totalCount: number) {
      state.departmentTotalCount = totalCount
    },
    changeDepartmentList(state, departmentList: any) {
      state.departmentList = departmentList
    },
    changeRoleTotalCount(state, totalCount: number) {
      state.roleTotalCount = totalCount
    },
    changeRoleList(state, roleList: any) {
      state.roleList = roleList
    },
    changeMenuList(state, menuList: any) {
      state.menuList = menuList
    },
    changeAutocomplete(state, payload) {
      let autoComplete = state.autoComplete[payload.pageName]
      if (!autoComplete) {
        autoComplete = []
      }
      if (payload.data.id) {
        autoComplete.unshift(payload.data)
      }
      // 去重 用id
      const autoCompleteNew: any = []
      autoComplete.map((item: any) => {
        if (
          autoCompleteNew.filter((obj: any) => {
            return obj.id === item.id
          }).length === 0
        ) {
          autoCompleteNew.push(item)
        }
      })
      state.autoComplete[payload.pageName] = autoCompleteNew.slice(0, 3)
    },
    saveMenus(state, menus: any) {
      const userMenus = menus
      state.userMenus = userMenus

      // 根据菜单映射路由
      const { routes, homeRoutes, fullRoutes } = menuMapToRoutes(userMenus)
      routes.forEach((route) => {
        // 注册管理端路由
        router.addRoute('main', route)
      })
      fullRoutes.forEach((route) => {
        // 注册全局路由
        router.addRoute('full-screen', route)
      })
      homeRoutes.forEach((route) => {
        // 注册用户端路由
        router.addRoute('home', route)
      })
    },
    saveToken(state, token: string) {
      state.token = token
    },
    saveUserInfo(state, userInfo: any) {
      state.userInfo = userInfo
    },
    saveUserGrade(state, userGrade: any) {
      state.userGrade = userGrade
    }
  },
  getters: {
    pageListData(state) {
      return (pageName: string) => {
        const listData: any[] = (state as any)[`${pageName}List`] ?? []
        return listData
      }
    },
    pageListDataCount(state) {
      return (pageName: string) => {
        const listCount = (state as any)[`${pageName}TotalCount`] ?? 0
        return listCount
      }
    },
    pageAutoComplete(state) {
      return (pageName: string) => {
        const listData: any[] = (state.autoComplete as any)[pageName] ?? []
        return listData
      }
    }
  },
  actions: {
    async getAdminMenuDataAction({ commit }, payload: IPagePayload) {
      const pageUrl = `${window.location.origin}/api/v1/system/menu/member-menu`
      if (pageUrl.length === 0) return
      const adminMenus = Service.listToTree(
        await getPageList(pageUrl, payload.queryInfo, true, true)
      )
      localCache.setCache('adminMenus', adminMenus)
      commit('saveMenus', adminMenus)
    },
    async getUserGrade({ commit }, payload: IPagePayload) {
      const pageUrl = `${window.location.origin}/api/v1/system/integral-result/grade`
      if (pageUrl.length === 0) return
      const userGrade = await getPageList(pageUrl, payload, true, true)
      localCache.setCache('userGrade', userGrade)
      commit('saveUserGrade', userGrade)
    },
    loadLocalCache({ commit }) {
      const token = localCache.getCache('token')
      if (token) {
        commit('saveToken', token)
      }
      const userInfo = localCache.getCache('currentUser')
      if (userInfo) {
        commit('saveUserInfo', userInfo)
      }
      const adminMenus = localCache.getCache('adminMenus')
      commit('saveMenus', adminMenus)
    },

    // 如果跟后端约定接口名与pagename保持一致，就可以用system中的统一的增删改查action，但是目前使用的是页面下的action
    async deletePageDataAction({ dispatch }, payload: IPagePayload) {
      const pageName = payload.pageName
      const deleteId = payload.id
      if (!deleteId) return
      const pageUrl = `/${pageName}/${deleteId}`
      await deletePageData(pageUrl)
      dispatch('getPageListDataAction', {
        pageName: payload.pageName,
        queryInfo: { pageSize: payload.queryInfo.pageSize, page: 1 }
      })
    },

    async newPageDataAction({ dispatch }, payload: IPagePayload) {
      const pageUrl = `/${payload.pageName}`
      const pageData = payload.queryInfo
      await newPageData(pageUrl, pageData)

      dispatch('getPageListDataAction', {
        pageName: payload.pageName,
        queryInfo: { pageSize: payload.queryInfo.pageSize, page: 1 }
      })
    },

    async editPageDataAction({ dispatch }, payload: IPagePayload) {
      if (!payload.id) return
      const pageUrl = `/${payload.pageName}/${payload.id}`
      const pageData = payload.queryInfo
      await editPageData(pageUrl, pageData)

      dispatch('getPageListDataAction', {
        pageName: payload.pageName,
        queryInfo: { offset: 0, size: 10 }
      })
    },

    // 保存自动搜索历史记录
    editAutocomplete({ commit }, payload) {
      commit('changeAutocomplete', payload)
    },

    // 文件上传
    async uploadPageDataAction(_, payload) {
      const pageUrl = `/file/upload`
      return await uploadPageData(pageUrl, payload)
    },

    //文件下载
    async downloadPageDataAction(_, payload) {
      const pageUrl = `/file/download?fileId=${payload.id}`
      return await pageDownlod(pageUrl, payload)
    }
  }
}

export default systemModule
