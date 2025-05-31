import { Navigate, useLocation } from 'react-router'

import { useUserAuthentication } from '../../context/userAuthentication'

export const SignUp = () => {
  const { isAuthenticated } = useUserAuthentication()
  const location = useLocation()

  if (isAuthenticated) return <Navigate to='/' state={{ from: location }} replace />

  return <div>Sign Up</div>
}
