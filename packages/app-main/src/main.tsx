import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

import { ProtectedRoute } from './components/protected_route'
import { DeviceContextProvider } from './contexts/deviceContext/DeviceContext'
import { UserAuthenticationProvider } from './contexts/userAuthentication/UserAuthenticationContext'
import { Tasks } from './pages'
import { NotFound } from './pages/404'
import { SignIn } from './pages/auth/sign_in'
import { SignUp } from './pages/auth/sign_up'
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
              {/* Task Management */}
              <Route index element=<Tasks /> />
            </Route>

            <Route path='*' element=<NotFound /> />
          </Routes>
        </BrowserRouter>
      </UserAuthenticationProvider>
    </DeviceContextProvider>
  </StrictMode>,
)
