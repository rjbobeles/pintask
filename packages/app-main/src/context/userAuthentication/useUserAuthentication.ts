import { useContext } from 'react'

import { IUserAuthentication, UserAuthenticationContext } from './UserAuthenticationContext'

export const useUserAuthentication = (): IUserAuthentication => {
  const context = useContext(UserAuthenticationContext)

  if (!context) throw new Error('useUserAuthentication must be used within a UserAuthenticationProvider')
  return context
}
