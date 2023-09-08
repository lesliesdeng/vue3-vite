import IRequest from './request/request'
import { API_BASE_URL, TIME_OUT } from './request/config'
import localCache from '@/utils/cache'
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus'
import { errorCodes } from './request/errorCodes'
import Service from '@/global/common'

const iRequest = new IRequest({
  baseURL: API_BASE_URL,
  timeout: TIME_OUT,
  interceptorHooks: {
    requestInterceptor: (config) => {
      const token = localCache.getCache('token')
      if (token) {
        config.headers!.Authorization = `${token.token_type}__${token.access_token}`
      }
      if (config.contentType) {
        config.headers!['Content-Type'] =
          config.contentType || 'application/x-www-form-urlencoded;charset=UTF-8'
      }
      return config
    },
    requestInterceptorCatch: (err) => {
      return err
    },
    responseInterceptor: (res: any) => {
      const errorDeal = (message: string, code: number) => {
        const errorMessage = message || '接口调用失败'
        ElMessage.error(errorMessage ? errorMessage : errorCodes[code])
      }
      if (
        res.headers['content-disposition'] &&
        res.headers['content-disposition'].indexOf('attachment') !== -1
      ) {
        //直接下载
        Service.downloadFile(res)
        return
      }
      if (res.status === 200 && (res.data.code === 200 || res.data.id || res.config.returnAll)) {
        return res.data
      } else if (res.data.type === 'application/json') {
        // 下载接口报错处理;
        // 下载接口中的responseType设置为了blob;但是在错误的时候返回的是json对象，json对象会被处理成blob；需要在此转换
        res.data.text().then((text: string) => {
          const { message, code } = JSON.parse(text)
          errorDeal(message, code)
        })
      } else {
        errorDeal(res.data.message, res.data.code)
      }

      return Promise.reject({})
    },
    responseInterceptorCatch: ({ response }) => {
      if (response.status) {
        const errorCode = response.data.errorCode
        const errorMessage = response.data.message || '接口调用失败'
        if (response.status !== 200) {
          // TODO 先不做登录跳转
          // if (response.status == 401) {
          //   Service.redirectToLogin()
          // }
          // 报错优先级，选取返回errorCode，再取状态码
          ElMessage.error(errorCodes[errorCode] ?? errorCodes[response.status] ?? '接口调用失败')
          return Promise.reject({})
        }
        if (errorCode !== 200) {
          ElMessage.error(errorMessage ? errorMessage : errorCodes[errorCode])
          return Promise.reject({})
        }
        return Promise.reject(response)
      }
    }
  }
})

export default iRequest
