import { ref } from 'vue'
import UploadModal from '@/components/upload-modal'

type CallbackFn = (item?: any) => void

export const useUploadModal = (editHandleCallback?: CallbackFn) => {
  const uploadModalRef = ref<InstanceType<typeof UploadModal>>()

  const handleUpload = (item: any) => {
    if (uploadModalRef.value) {
      uploadModalRef.value.dialogVisible = true
    }
    editHandleCallback && editHandleCallback(item)
  }

  return [uploadModalRef, handleUpload]
}
