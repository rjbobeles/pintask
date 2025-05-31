import { createContext, useEffect, useState } from 'react'

export interface IUserAuthentication {
  accessToken: string | null
  refreshToken: string | null
  setAccessToken: (value: string | null) => void
  setRefreshToken: (value: string | null) => void
  isAuthenticated: boolean
}

export const UserAuthenticationContext = createContext<IUserAuthentication | undefined>(undefined)

export const UserAuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('refresh_token')
    if (storedToken) {
      setRefreshToken(storedToken)
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (refreshToken === null && !localStorage.getItem('refresh_token')) return

    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem('refresh_token')
      setIsAuthenticated(false)
    }
  }, [refreshToken])

  return (
    <UserAuthenticationContext.Provider value={{ accessToken, setAccessToken, refreshToken, setRefreshToken, isAuthenticated }}>
      {children}
    </UserAuthenticationContext.Provider>
  )
}
