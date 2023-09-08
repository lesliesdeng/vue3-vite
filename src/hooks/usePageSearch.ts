import { ref } from 'vue'
import PageContent from '@/components/page-content'

export const usePageSearch = () => {
  const pageContentRef = ref<InstanceType<typeof PageContent>>()
  const handleQueryClick = (queryInfo: any) => {
    pageContentRef.value?.getPageData(queryInfo)
  }
  const handleResetClick = (onlyInitPage?: boolean) => {
    onlyInitPage
      ? (pageContentRef.value!.pageInfo.currentPage = 1)
      : pageContentRef.value?.getPageData()
  }

  // 其他操作，操作后刷新,prams:参数  action：需要操作接口
  const handleAfterUpdataClick = (prams: any, action: string, store: any, initPage?: boolean) => {
    store &&
      store.dispatch(`${pageContentRef.value?.pageName}/${action}`, prams).then(() => {
        // 是否刷新到首页，不传刷新当前页
        initPage && (pageContentRef.value!.pageInfo.currentPage = 1)
        pageContentRef.value?.getPageData()
      })
  }
  // 保留上次筛选条件的筛选
  const handleUpdataPageUserQueryInfo = (store: any) => {
    const pageName = pageContentRef.value!.pageName
    pageContentRef.value?.getPageData(store.state[pageName][`${pageName}QueryInfo`])
  }

  return {
    pageContentRef,
    handleQueryClick,
    handleResetClick,
    handleAfterUpdataClick,
    handleUpdataPageUserQueryInfo
  }
}
