import { ArrowLeft, Home, Search } from 'lucide-react'
import { useNavigate } from 'react-router'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        {/* Logo */}
        <div className='mb-8'>
          <h1 className='text-4xl font-black text-blue-600 mb-2' style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            PinTask
          </h1>
        </div>

        {/* 404 Illustration */}
        <div className='mb-8'>
          <div className='inline-flex items-center justify-center w-32 h-32 bg-blue-100 rounded-full mb-6'>
            <Search className='w-16 h-16 text-blue-600' />
          </div>

          <div className='space-y-2'>
            <h2 className='text-6xl font-black text-gray-900'>404</h2>
            <h3 className='text-2xl font-bold text-gray-800'>Page Not Found</h3>
            <p className='text-gray-600 font-light'>
              Oops! The page you're looking for seems to have wandered off. Don't worry, it happens to the best of us.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='space-y-4'>
          <button
            onClick={() => navigate('/')}
            className='w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2'
          >
            <Home className='w-5 h-5' />
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate(-1)}
            className='w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'
          >
            <ArrowLeft className='w-5 h-5' />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className='mt-8 pt-6 border-t border-gray-200'>
          <p className='text-sm text-gray-500 mb-4'>Still can't find what you're looking for?</p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-2 text-sm'>
            <button onClick={() => navigate('#')} className='text-blue-600 hover:text-blue-700 font-medium'>
              Contact Support
            </button>
            <span className='hidden sm:inline text-gray-400'>•</span>
            <button onClick={() => navigate('#')} className='text-blue-600 hover:text-blue-700 font-medium'>
              Help Center
            </button>
            <span className='hidden sm:inline text-gray-400'>•</span>
            <button onClick={() => navigate('#')} className='text-blue-600 hover:text-blue-700 font-medium'>
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
