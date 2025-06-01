import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { useUserAuthentication } from '../contexts/userAuthentication'

export const ProtectedRoute = () => {
  const { isAuthenticated } = useUserAuthentication()

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) navigate('/auth/sign_in', { state: { from: location }, replace: true })
  }, [isAuthenticated, location, navigate])

  return <Outlet />
}
