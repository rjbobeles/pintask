import { useNavigate } from 'react-router'

import { useUserAuthentication } from '../context/userAuthentication'

export const Tasks = () => {
  const { refreshToken } = useUserAuthentication()
  const navigate = useNavigate()

  if (!refreshToken) navigate('/auth/sign_in')
  return <div>Index</div>
}
