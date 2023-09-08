import { ref } from 'vue'
import PageModal from '@/components/page-modal'

type CallbackFn = (item?: any) => void

export const usePageModal = (newHandleCallback?: CallbackFn, editHandleCallback?: CallbackFn) => {
  const modalInfo = ref({})
  const pageModalRef = ref<InstanceType<typeof PageModal>>()
  const handleNewData = async () => {
    modalInfo.value = {}
    const newData = () => {
      if (pageModalRef.value) {
        pageModalRef.value.dialogVisible = true
        pageModalRef.value.readonly = false
      }
    }
    if (!newHandleCallback) {
      newData()
    } else {
      await newHandleCallback()
      newData()
    }
  }

  const handleEditData = async (item: any, readonly?: boolean) => {
    modalInfo.value = { ...item }
    const editData = () => {
      if (pageModalRef.value) {
        pageModalRef.value.dialogVisible = true
        pageModalRef.value.readonly = !!readonly
      }
    }
    if (!editHandleCallback) {
      editData()
    } else {
      await editHandleCallback(item)
      editData()
    }
  }

  // 获取当前行数据
  const handleGetInfo = (item: any, getInfoHandleCallback?: CallbackFn) => {
    modalInfo.value = { ...item }
    getInfoHandleCallback && getInfoHandleCallback(item)
  }

  return { modalInfo, pageModalRef, handleNewData, handleEditData, handleGetInfo }
}
