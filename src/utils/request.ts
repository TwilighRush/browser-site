import { useToast } from './toast'

const API_HOST = ''
// 'http://101.42.252.156:3000'

interface RequestOptions extends RequestInit {
  baseURL?: string
  timeout?: number
  params?: Record<string, any>
}

interface CustomResponse<T = any> {
  code: number
  data: T
  message: string
}

class RequestError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any,
  ) {
    super(message)
    this.name = 'RequestError'
  }
}

const DEFAULT_OPTIONS: RequestOptions = {
  baseURL: API_HOST || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  } as Record<string, string>,
}

// 添加刷新 token 相关的类型和变量
interface TokenInfo {
  token: string
  refreshToken: string
}

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

// 添加订阅刷新 token 的函数
function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

// 执行所有订阅者的回调
function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token))
  refreshSubscribers = []
}

// 修改刷新 token 的函数
async function refreshToken(): Promise<string> {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token')
    }

    const response = await fetch(`${DEFAULT_OPTIONS.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || '刷新token失败')
    }

    // 只保存 access token
    localStorage.setItem('token', data.token)

    return data.token
  } catch (error) {
    // token 刷新失败，清除用户信息
    localStorage.removeItem('token')
    throw error
  }
}

async function request<T = any>(
  url: string,
  options: RequestOptions = {},
): Promise<CustomResponse<T>> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  // 添加请求拦截器处理
  if (requestInterceptor) {
    const token = localStorage.getItem('token')
    if (token) {
      mergedOptions.headers = {
        ...mergedOptions.headers,
        Authorization: `Bearer ${token}`,
      }
    }
    const interceptedOptions = requestInterceptor(mergedOptions)
    Object.assign(mergedOptions, interceptedOptions)
  }

  const { baseURL, timeout, params, ...fetchOptions } = mergedOptions
  const toast = useToast()

  let fullUrl = url.startsWith('/') ? `${baseURL}${url}` : url

  // 处理查询参数
  if (params) {
    const queryString = new URLSearchParams(params).toString()
    fullUrl += `?${queryString}`
  }

  // 处理请求体
  if (fetchOptions.body && typeof fetchOptions.body === 'object') {
    fetchOptions.body = JSON.stringify(fetchOptions.body)
  }

  // 超时控制
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  fetchOptions.signal = controller.signal

  try {
    const response = await fetch(fullUrl, fetchOptions)
    clearTimeout(timeoutId)

    // 获取响应数据
    const data = await response.json()

    // 处理 token 过期
    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true
        try {
          const newToken = await refreshToken()
          isRefreshing = false
          onRefreshed(newToken)

          // 使用新 token 重试当前请求
          mergedOptions.headers = {
            ...mergedOptions.headers,
            Authorization: `Bearer ${newToken}`,
          }
          return request<T>(url, mergedOptions)
        } catch (error) {
          isRefreshing = false
          throw error
        }
      } else {
        // 等待其他请求刷新 token
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            mergedOptions.headers = {
              ...mergedOptions.headers,
              Authorization: `Bearer ${token}`,
            }
            resolve(request<T>(url, mergedOptions))
          })
        })
      }
    }

    // 处理 HTTP 错误
    if (!response.ok) {
      const errorMsg = data.message || '请求失败'
      toast.show(errorMsg, 'error')
      throw new RequestError(errorMsg, response.status, data)
    }

    // 处理业务错误
    if (data.failed) {
      const errorMsg = data.message || '业务处理失败'
      toast.show(errorMsg, 'error')
      throw new RequestError(errorMsg, data.code, data)
    }

    return data
  } catch (error: any) {
    if (error instanceof RequestError) {
      throw error
    }

    let errorMsg = '网络请求失败'
    if (error.name === 'AbortError') {
      errorMsg = '请求超时'
    }

    toast.show(errorMsg, 'error')
    throw new RequestError(error.message || errorMsg)
  }
}

// 便捷方法
export const get = <T = any>(url: string, options?: RequestOptions) =>
  request<T>(url, { ...options, method: 'GET' })

export const post = <T = any>(
  url: string,
  data?: any,
  options?: RequestOptions,
) => request<T>(url, { ...options, method: 'POST', body: data })

export const put = <T = any>(
  url: string,
  data?: any,
  options?: RequestOptions,
) => request<T>(url, { ...options, method: 'PUT', body: data })

export const del = <T = any>(url: string, options?: RequestOptions) =>
  request<T>(url, { ...options, method: 'DELETE' })

// 请求拦截器
let requestInterceptor: ((options: RequestOptions) => RequestOptions) | null =
  null

// 响应拦截器
let responseInterceptor: ((response: CustomResponse) => CustomResponse) | null =
  null

export const setRequestInterceptor = (
  interceptor: (options: RequestOptions) => RequestOptions,
) => {
  requestInterceptor = interceptor
}

export const setResponseInterceptor = (
  interceptor: (response: CustomResponse) => CustomResponse,
) => {
  responseInterceptor = interceptor
}

// 修改默认的请求拦截器实现
setRequestInterceptor((options: RequestOptions) => {
  const token = localStorage.getItem('token')
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return options
})

export default request
