import { createContext, useCallback, useEffect, useState } from 'react'

import { axiosClient } from '../../services/Axios'
import { useDeviceContext } from '../deviceContext'

export interface IUserInfo {
  _id: string
  firstName: string
  lastName: string
}

export interface IUserAuthentication {
  accessToken: string | null
  setAccessToken: (value: string | null) => void
  refreshToken: string | null
  setRefreshToken: (value: string | null) => void
  userInfo: IUserInfo
  setUserInfo: (value: IUserInfo) => void

  isAuthenticated: boolean
  refreshTokens: () => Promise<void>
  logout: () => void
}

export const UserAuthenticationContext = createContext<IUserAuthentication | undefined>(undefined)

export const UserAuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const { deviceId } = useDeviceContext()

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<IUserInfo>({ _id: '', firstName: '', lastName: '' })
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const refreshTokens = useCallback(async () => {
    if (!refreshToken || deviceId === '') return

    try {
      const response = await axiosClient.post(
        '/api/session/refresh',
        {},
        {
          headers: {
            device_id: deviceId,
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      )

      const { first_name, last_name, _id } = response.data.user
      setUserInfo({ _id: _id, firstName: first_name, lastName: last_name })

      const { access_token, refresh_token } = response.data.tokens
      setAccessToken(access_token)
      setRefreshToken(refresh_token)
      setIsAuthenticated(true)
      localStorage.setItem('refresh_token', refresh_token)
    } catch {
      setAccessToken(null)
      setRefreshToken(null)
      setIsAuthenticated(false)
      localStorage.removeItem('refresh_token')
    }
  }, [deviceId, refreshToken])

  const logout = useCallback(async () => {
    if (!accessToken || deviceId === '') return

    try {
      await axiosClient.post(
        '/api/session/logout',
        {},
        {
          headers: {
            device_id: deviceId,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      setAccessToken(null)
      setRefreshToken(null)
      setIsAuthenticated(false)
      localStorage.removeItem('refresh_token')
    } catch {
      setAccessToken(null)
      setRefreshToken(null)
      setIsAuthenticated(false)
      localStorage.removeItem('refresh_token')
    }
  }, [deviceId, accessToken])

  useEffect(() => {
    const storedToken = localStorage.getItem('refresh_token')
    if (storedToken) setRefreshToken(storedToken)
  }, [])

  useEffect(() => {
    if (deviceId === '') return

    const storedToken = localStorage.getItem('refresh_token')

    if (refreshToken !== storedToken) {
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
      else localStorage.removeItem('refresh_token')
    }

    if (refreshToken && accessToken) setIsAuthenticated(true)
    if (refreshToken && !accessToken) refreshTokens()
  }, [refreshToken, accessToken, deviceId, refreshTokens])

  return (
    <UserAuthenticationContext.Provider
      value={{ accessToken, setAccessToken, refreshToken, setRefreshToken, userInfo, setUserInfo, isAuthenticated, refreshTokens, logout }}
    >
      {children}
    </UserAuthenticationContext.Provider>
  )
}
