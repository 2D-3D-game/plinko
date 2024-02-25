import { HttpClient } from 'feie-ui'

interface IResponse<T> {
  status: boolean
  data: T
}

function getDevice() {
  const isMobile = window.innerWidth <= 768
  if (isMobile)
    return 25
  else return 24
}

export const httpClient =  new HttpClient({
  baseURL: import.meta.env.DEV ? "/api" : location.origin,
  timeout: 10000,
  isEncryption: false,
  isSign: true,
  showConsole:true,
  requestInterceptors: [
    (config: any) => {
      config.headers.d = getDevice()
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


