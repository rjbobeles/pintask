import { ChevronDown, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useUserAuthentication } from '../../contexts/userAuthentication'

export const NavBar = () => {
  const { userInfo, logout } = useUserAuthentication()

  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className='bg-white shadow-sm border-b'>
      <div className='max-w-6xl mx-auto px-4 py-4'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <h1 className='text-3xl font-black text-blue-600' style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              PinTask
            </h1>
          </div>

          <div className='relative' ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className='flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors'
            >
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                <User className='w-4 h-4 text-blue-600' />
              </div>
              <div className='hidden md:block text-left'>
                <div className='text-sm font-medium'>{userInfo.firstName || '-'}</div>
                <div className='text-xs text-gray-500'>ID: {userInfo._id}</div>
              </div>
              <ChevronDown className='w-4 h-4 text-gray-400' />
            </button>

            {showDropdown && (
              <div className='absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50'>
                <div className='px-4 py-2 border-b border-gray-100'>
                  <div className='text-sm font-medium'>{userInfo.firstName || '-'}</div>
                  <div className='text-xs text-gray-500 break-all'>ID: {userInfo._id}</div>
                </div>

                <button disabled className='w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed flex items-center gap-2'>
                  <User className='w-4 h-4' />
                  Profile Settings
                </button>

                <button onClick={() => logout()} className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3-3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                    />
                  </svg>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
