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

async function request<T = any>(
  url: string,
  options: RequestOptions = {},
): Promise<CustomResponse<T>> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }
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

// 处理认证相关
export const setToken = (token: string) => {
  DEFAULT_OPTIONS.headers = {
    ...DEFAULT_OPTIONS.headers,
    Authorization: `Bearer ${token}`,
  }
}

export const clearToken = () => {
  const headers = DEFAULT_OPTIONS.headers as Record<string, string>
  const { Authorization: _, ...rest } = headers
  DEFAULT_OPTIONS.headers = rest
}

export default request
