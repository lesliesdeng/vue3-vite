import { ElNotification } from 'element-plus'
import 'element-plus/theme-chalk/el-notification.css'

const progrssList: any = []
const notify: any = {}
const downloadFn = (event: any, sign: any, fileName?: string) => {
  const { loaded, total } = event
  if (!loaded || !total) {
    return
  }
  const progress = Math.floor((loaded / total) * 100)
  const index = progrssList.findIndex((item: any) => {
    return sign == item.sign
  })
  const progressItem = progrssList[index]
  // 同一个下载任务改变原始进度，否则新建任务
  if (progressItem) {
    progressItem.progress = progress
    const element = document.getElementById(sign)
    if (progress) {
      // 如果页面已经有该进度对象的弹框，则更新它的进度progress
      element!.innerHTML = '正在下载...' + progress + '%'
    } else {
      // 此处容错处理，如果后端传输文件流报错，删除当前进度对象
      element!.innerHTML = '下载出错了...'
      notify[sign]?.close && notify[sign].close()
      progrssList.splice(index, 1) // 删除进度对象
      return
      // 如果页面中没有该进度对象所对应的弹框，页面新建弹框，并在notify中加入该弹框对象，属性名为该进度对象的sign(sign是唯一的)
    }
    if (progress == 100) {
      // 如果下载进度到了100%，关闭该弹框，并删除notify中维护的弹框对象
      notify[sign]?.close && notify[sign].close()
      progrssList.splice(index, 1) // 删除progressList中的进度对象
    }
    // 如果初始进度大于80%；不需显示进度条，避免快速闪动和进度弹框不消失
  } else if (progress <= 80 && progress > 0) {
    progrssList.push({ sign, progress })
    notify[sign] = ElNotification({
      title: fileName,
      dangerouslyUseHTMLString: true,
      message: `<span id=${sign}>正在下载...${progress}%</span>`, // 显示下载百分比，类名为进度对象的sign(便于后面更新进度百分比)
      showClose: false,
      position: 'bottom-left',
      type: 'success',
      duration: 0,
      onClose: () => {
        delete notify[sign]
      }
    })
  }
}
export { downloadFn }
