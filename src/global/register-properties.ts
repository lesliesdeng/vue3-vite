import { App } from 'vue'
import { utcToDateTimeFormat } from '@/utils/date-formt'

function registerGlobalProperties(app: App) {
  app.config.globalProperties.$filters = {
    showStatus(enable: string | number, statusMap: any) {
      return statusMap[enable].title
    },
    formatTime(value: string) {
      return utcToDateTimeFormat(value)
    }
  }
  app.config.globalProperties.form
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: any
  }
}
export default registerGlobalProperties
