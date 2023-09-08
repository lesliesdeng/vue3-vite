export function fileSizeFormat(size = 0, digitSize = 2) {
  if (size === 0) return '0 B'
  if (size === null) return '暂无'
  const unitMap = ['B', 'KB', 'MB', 'GB', 'TB']
  const SIZE_Flag = 1024
  const unit = Math.floor(Math.log(size) / Math.log(SIZE_Flag))
  return parseFloat((size / Math.pow(SIZE_Flag, unit)).toFixed(digitSize)) + ' ' + unitMap[unit]
}

export function fileUrlPrefix(url: string) {
  if (url === undefined) return '/img/menu-logo.png'
  return `${location.origin}/api/v1/cultural/file/${url}`
}

export function fileUrlToBase64(url: string) {
  if (!url) return '/img/menu-logo.png'
  const isInclude = url.includes('data:image/png;base64,')
  return isInclude ? url : `data:image/png;base64,${url}`
}

export function resImg(fileItem: any) {
  const impMap = ['folder', '', 'audio', 'video', 'file']
  if (fileItem.isDir === 1) {
    return new URL(`@/assets/img/thumb/${impMap[0]}.png`, import.meta.url).href

  }
  if (fileItem.isDesign === 1) {
    return new URL(`@/assets/img/thumb/design.png`, import.meta.url).href
  }
  if (![1, 5, 6].includes(fileItem.fileType)) {
    return new URL(`@/assets/img/thumb/${fileItem.fileType ? impMap[fileItem.fileType] : impMap[4]}.png`, import.meta.url).href
  } else {
    return fileUrlToBase64(fileItem.compress)
  }
}

// 文件类型
export function resType(type: any, isDir: number) {
  return isDir == 0
    ? { '1': '图片素材', '2': '音频素材', '3': '视频素材', '5': '模板', '6': '文档' }[type]
    : '文件夹'
}

export function getShareDate(data: any, statusMap: any) {
  if (data.shareStatus != 1) {
    return statusMap[data.shareStatus]
  }
  if (Math.sign(data.usefulDay) == 1) {
    return `${data.usefulDay}天后到期`
  }
  if (Math.sign(data.usefulDay) == -1) {
    return `分享已过期`
  }
  return '24小时内到期'
}
