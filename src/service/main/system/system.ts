import iRequest from '../../index'
import { downloadFn } from '@/global/download'

export function getPageList(
  pageUrl: string,
  queryInfo?: any,
  showLoading?: boolean,
  returnAll?: boolean
) {
  return iRequest.get({
    url: pageUrl,
    data: queryInfo,
    showLoading: showLoading !== undefined ? showLoading : true,
    returnAll: returnAll !== undefined ? returnAll : false
  })
}

export function deletePageData(pageUrl: string) {
  return iRequest.delete({
    url: pageUrl,
    showLoading: true
  })
}

export function newPageData(pageUrl: string, newData: any) {
  return iRequest.post({
    url: pageUrl,
    data: newData,
    showLoading: true
  })
}

export function editPageData(pageUrl: string, editData: any, returnAll?: boolean) {
  return iRequest.post({
    url: pageUrl,
    data: editData,
    showLoading: true,
    returnAll
  })
}
export function uploadPageData(pageUrl: string, uploadData: any) {
  const formData = new FormData()
  Object.keys(uploadData).forEach(function (key) {
    formData.append(key, uploadData[key])
  })
  return iRequest.post({
    url: pageUrl,
    data: formData,
    showLoading: true,
    loadingText: '文件上传中...',
    contentType: 'multipart/form-data'
  })
}

export function pageDownlod(pageUrl: string, payload?: any, data?: any) {
  const sign = new Date().getTime()
  return iRequest.get({
    url: pageUrl,
    showLoading: false,
    responseType: 'blob',
    data,
    onDownloadProgress: (event: any) => {
      const fileNameArr = payload.fileName.split('.')
      const fileType = fileNameArr[fileNameArr.length - 1]
      // 如果后缀为ppt的下载，改为zip
      const fileName =
        fileType === 'ppt'
          ? fileNameArr
              .splice(0, fileNameArr.length - 1)
              .concat(['zip'])
              .join('.')
          : payload.fileName
      !payload?.isShowLoading && downloadFn(event, sign, fileName)
    }
  })
}
