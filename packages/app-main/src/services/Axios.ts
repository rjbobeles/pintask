import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: 'http://localhost:4000',
})

let refreshTokenPromise: Promise<void> | null = null
export const setupTokenRefreshInterceptor = (
  getAccessToken: () => string | null,
  getRefreshToken: () => string | null,
  getDeviceId: () => string,
  refreshTokensCallback: () => Promise<void>,
  logoutCallback: () => void,
) => {
  axiosClient.interceptors.request.use(
    (config) => {
      const token = getAccessToken()
      const deviceId = getDeviceId()

      config.headers['Content-Type'] = 'application/json'

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      if (deviceId) {
        config.headers.device_id = deviceId
      }

      return config
    },
    (error) => Promise.reject(error),
  )

  axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      const is401 = error.response?.status === 401
      const hasAuthError = error.response?.data?.error_code === 'ACCOUNT_AUTHENTICATION_ERROR'

      if (is401 && hasAuthError && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          if (!refreshTokenPromise) refreshTokenPromise = refreshTokensCallback()

          await refreshTokenPromise
          refreshTokenPromise = null

          return axiosClient(originalRequest)
        } catch (refreshError) {
          refreshTokenPromise = null
          logoutCallback()
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )
}
