import { HttpClient } from 'feie-ui'

interface IResponse<T> {
  status: boolean
  data: T
}


export const httpClient =  new HttpClient({
  baseURL: import.meta.env.DEV ? "/api" : location.origin,
  timeout: 10000,
  isEncryption: true,
  showConsole:true,
  requestInterceptors: [
    (config: any) => {
      config.headers.d = 24
      config.headers.t = window.miniGameWujie.props.token || ""
      config.headers.lang = window.miniGameWujie.props.backendLang || "zh_CN"

      return config
    },
  ],
  responseInterceptors:[
    (response) => {
      const { status, data } = response.data as IResponse<any>

      if (!status) {
        if (data === 'token') {
          window.miniGameWujie.bus.$emit('openRegister');
        }
        else {
          if (!response.config.params?.noNotify) {
            window.miniGameWujie.props.openNotify({ type: 'error', message: data });
          }
        }

        return Promise.reject(new Error(`发生错误：status: ${status}, data: ${data}`))
      }
      return response
    },
  ]
})


