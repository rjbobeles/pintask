import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

import { ProtectedRoute } from './components/protected_route'
import { DeviceContextProvider } from './context/deviceContext/DeviceContext'
import { UserAuthenticationProvider } from './context/userAuthentication/UserAuthenticationContext'
import { Tasks } from './pages'
import { SignIn } from './pages/auth/sign_in'
import { SignUp } from './pages/auth/sign_up'
import { Profile } from './pages/user/profile'
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <DeviceContextProvider>
      <UserAuthenticationProvider>
        <BrowserRouter>
          <Routes>
            {/* Authentication */}
            <Route path='auth'>
              <Route path='sign_in' element=<SignIn /> />
              <Route path='sign_up' element=<SignUp /> />
            </Route>

            <Route element=<ProtectedRoute />>
              {/* User Management */}
              <Route path='user'>
                <Route index element=<Profile /> />
              </Route>

              {/* Task Management */}
              <Route index element=<Tasks /> />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserAuthenticationProvider>
    </DeviceContextProvider>
  </StrictMode>,
)
