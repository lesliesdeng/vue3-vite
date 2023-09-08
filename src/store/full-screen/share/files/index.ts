import { Module } from 'vuex'
import { ShareFilesState } from './types'
import { IPagePayload } from '@/store/main/system/types'
import { IRootState } from '@/store/types'

import { getPageList, editPageData } from '@/service/main/system/system'

const shareFilesModule: Module<ShareFilesState, IRootState> = {
  namespaced: true,
  state() {
    return {
      shareFilesTotalCount: 0,
      shareFilesList: [],
      shareFilesAutoList: [],
      shareFilesQueryInfo: null
    }
  },
  mutations: {
    changeShareFilesTotalCount(state, totalCount: number) {
      state.shareFilesTotalCount = totalCount
    },
    changeShareFilesList(state, userList: any) {
      state.shareFilesList = userList
    },
    changeShareFilesAutoList(state, autoList: any) {
      state.shareFilesAutoList = autoList
    },
    changeShareFilesQueryInfo(state, queryInfo: any) {
      state.shareFilesQueryInfo = queryInfo
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
    autoListData(state) {
      return (pageName: string) => {
        const autoList = (state as any)[`${pageName}AutoList`] ?? []
        return autoList
      }
    }
  },
  actions: {
    async getPageListDataAction({ commit }, payload: IPagePayload) {
      const pageUrl = `/myCreation/page`
      if (pageUrl.length === 0) return
      const { total, list } = await getPageList(pageUrl, payload.queryInfo)
      list && commit('changeShareFilesTotalCount', total)
      list && commit('changeShareFilesList', list)
      payload && commit('changeShareFilesQueryInfo', payload.queryInfo)
    },
    async getShareDetailAction(_, payload) {
      const pageUrl = '/myShare/getShare'
      return await editPageData(pageUrl, payload, true)
    }
  }
}

export default shareFilesModule
