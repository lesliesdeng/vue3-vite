import axios from 'axios'
import QS from 'qs'
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import { ElLoading } from 'element-plus'
import 'element-plus/es/components/loading/style/css'
import { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'

interface InterceptorHooks {
  requestInterceptor?: (config: IRequestConfig) => IRequestConfig
  requestInterceptorCatch?: (error: any) => any

  responseInterceptor?: (response: AxiosResponse) => AxiosResponse
  responseInterceptorCatch?: (error: any) => any
}

interface IRequestConfig extends AxiosRequestConfig {
  showLoading?: boolean
  loadingText?: string
  contentType?: string
  returnAll?: boolean
  interceptorHooks?: InterceptorHooks
}

interface IData {
  data: any
  code: number
  success: boolean
  message: string
}

class IRequest {
  config: AxiosRequestConfig
  interceptorHooks?: InterceptorHooks
  showLoading: boolean
  loading?: LoadingInstance
  instance: AxiosInstance

  constructor(options: IRequestConfig) {
    this.config = options
    this.interceptorHooks = options.interceptorHooks
    this.showLoading = options.showLoading ?? true
    this.instance = axios.create(options)

    this.setupInterceptor()
  }

  setupInterceptor(): void {
    this.instance.interceptors.request.use(
      // @ts-ignore
      this.interceptorHooks?.requestInterceptor,
      this.interceptorHooks?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptorHooks?.responseInterceptor,
      this.interceptorHooks?.responseInterceptorCatch
    )
    // @ts-ignore
    this.instance.interceptors.request.use((config: IRequestConfig) => {
      if (config.showLoading) {
        this.loading = ElLoading.service({
          lock: true,
          text: config.loadingText ?? '加载中...',
          background: 'rgba(255, 255, 255, 0.8)',
          customClass: 'index-3000'
        })
      }
      return config
    })

    this.instance.interceptors.response.use(
      (res) => {
        this.showLoading && this.loading?.close()
        return res
      },
      (err) => {
        this.showLoading && this.loading?.close()
        return err
      }
    )
  }

  request<T = any>(config: IRequestConfig): Promise<T> {
    let url = config.url
    // 关闭遮罩层
    if (!config.showLoading) {
      this.showLoading = false
    }
    // 请求参数处理
    if (config.contentType !== 'multipart/form-data') {
      config.data = QS.stringify(config.data, { arrayFormat: 'indices', allowDots: true })
    }
    // get请求参数处理
    if (config.method === 'GET') {
      config.data && (url = `${config.url}?${config.data}`)
    }
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, IData>({ ...config, url })
        .then((res) => {
          if (res?.code === 200) {
            // @ts-ignore
            resolve(res.data)
            // @ts-ignore
          } else if (res?.id || config.returnAll) {
            // @ts-ignore
            resolve(res)
          } else {
            reject(res)
          }
          this.showLoading = true
        })
        .catch((err) => {
          reject(err)
          this.showLoading = true
        })
    })
  }

  get<T = any>(config: IRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = any>(config: IRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }

  delete<T = any>(config: IRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }

  patch<T = any>(config: IRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PATCH' })
  }
}
export default IRequest
