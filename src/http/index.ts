import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import {useAppStore} from '~/store/app'

interface IResponse<T> {
  status: boolean
  data: T
}
type IRequestInterceptors = (
  value: InternalAxiosRequestConfig<any>
) => InternalAxiosRequestConfig<any>

type IResponseInterceptors = (
  value: AxiosResponse<any>
) => AxiosResponse<any> | Promise<Error>



class HttpClient {
  cancelTokenList: AbortController[] = []

  private instance = axios.create({
    baseURL: import.meta.env.DEV ? "/api" : location.origin,
    timeout: 12000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })

  constructor() {
    this.setInterceptors()
  }

  /** 获取当前设备信息 */
  #getDevice() {
    const isMobile = window.innerWidth <= 768
    if (isMobile)
      return 25

    else
      return 24
  }


  private requestInterceptorsList: IRequestInterceptors[] = [
    // 设置token和dn
    (config) => {
        const {token} = storeToRefs( useAppStore())
        if (token.value)
          config.headers.t = token.value

      return config
    },
    // 设置全局header
    (config) => {
      config.headers.d = '25'
      config.headers.lang = window.miniGameWujie.props.backendLang
      return config
    },
    // 设置AbortController
    (config) => {
      const controller = new AbortController()
      config.signal = controller.signal
      this.cancelTokenList.push(controller)
      return config
    },
  ]

  private responseInterceptorsList: IResponseInterceptors[] = [
    (response) => {
      const { status, data } = response.data as IResponse<any>

      if (!status) {
        if (data === 'token') {
          window.miniGameWujie.bus.$emit('openRegister');
        }
        else {
          if (!response.config.params?.noNotify) {
            window.miniGameWujie.props.openNotify({type:'error',message:data});
          }
        }

        return Promise.reject(new Error(`发生错误：status: ${status}, data: ${data}`))
      }
      return response
    },
    // 请求完成后，移除AbortController
    (response) => {
      this.cancelTokenList = this.cancelTokenList.filter(item => item !== response.config.signal as any)
      return response
    },
    // 处理后端status为true的情况，只将data返回
    (response) => {
      const { status, data } = response.data as IResponse<any>
      if (status)
        response.data = data

      return response
    },
  ]

  private setInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        for (const interceptor of this.requestInterceptorsList)
          interceptor(config)

        return config
      },
      (error) => {
        // 判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
          console.error('请求超时')
          return
        }

        return Promise.reject(error)
      },
    )

    this.instance.interceptors.response.use(
      async (response) => {
        for (const interceptor of this.responseInterceptorsList) {
          const interceptorResult = await interceptor(response)
          if (interceptorResult instanceof Error)
            return Promise.reject(interceptorResult)
        }
        return response.data
      }, (error) => {

        return Promise.reject(error)
      },
    )
  }

  /** 关闭所有请求 */
  cancelAllRequest() {
    this.cancelTokenList.forEach(item => item.abort())
    this.cancelTokenList = []
  }

  get<T>(url: string, config?: AxiosRequestConfig<any>): Promise<T> {
    return this.instance.get(url, config)
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<T> {
    return this.instance.post(url, data, config)
  }
}

export const httpClient = new HttpClient()
