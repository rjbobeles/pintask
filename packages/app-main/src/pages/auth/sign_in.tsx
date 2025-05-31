import { Navigate, useLocation } from 'react-router'

import { useUserAuthentication } from '../../context/userAuthentication'

export const SignIn = () => {
  const { isAuthenticated } = useUserAuthentication()
  const location = useLocation()

  if (isAuthenticated) return <Navigate to='/' state={{ from: location }} replace />

  return <div>Sign In</div>
}
