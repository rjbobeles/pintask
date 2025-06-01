import { AxiosError } from 'axios'
import { Eye, EyeOff, Lock, Mail, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { useDeviceContext } from '../../contexts/deviceContext'
import { useUserAuthentication } from '../../contexts/userAuthentication'
import { axiosClient } from '../../services/Axios'

interface SignInFormData {
  email: string
  password: string
}

export const SignIn = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const { isAuthenticated, setAccessToken, setRefreshToken, setUserInfo } = useUserAuthentication()
  const { deviceId } = useDeviceContext()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { state: { from: location }, replace: true })
    }
  }, [isAuthenticated, location, navigate])

  const onSubmit = async (data: SignInFormData) => {
    try {
      setError(null)

      const response = await axiosClient.post(
        '/api/auth/sign_in',
        { email: data.email, password: data.password },
        {
          headers: {
            device_id: deviceId,
          },
        },
      )

      if (response.status === 200) {
        setUserInfo({ _id: response.data.user._id, firstName: response.data.user.first_name, lastName: response.data.user.last_name })
        setAccessToken(response.data.tokens.access_token)
        setRefreshToken(response.data.tokens.refresh_token)
      }

      navigate('/')
    } catch (error) {
      if (error instanceof AxiosError) setError(error.response?.data.message)

      console.error('Sign in error:', error)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white rounded-2xl shadow-lg p-8'>
        <div className='text-center mb-6'>
          <h1 className='text-4xl font-black text-blue-600 mb-2' style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            PinTask
          </h1>
          <p className='text-gray-600 font-light'>Welcome back! Please sign in to continue.</p>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-xl p-4 my-4 flex items-center gap-3'>
            <div className='bg-red-100 rounded-full p-1'>
              <X className='w-4 h-4 text-red-600' />
            </div>
            <div>
              <h4 className='text-red-800 font-medium'>Login Failed</h4>
              <p className='text-red-700 text-sm'>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='email'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='Enter your email'
              />
            </div>
            {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                })}
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='Enter your password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
            {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>}
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className='text-center mt-6'>
          <p className='text-gray-600'>
            Don't have an account?{' '}
            <button onClick={() => navigate('/auth/sign_up')} className='text-blue-600 hover:text-blue-700 font-medium'>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
