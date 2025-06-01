import { ChevronDown, Filter } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { ITaskFilter } from '../../types/TaskFilters'

export const TaskFilters = ({
  filters,
  onFilterChange,
  activeFiltersCount,
}: {
  filters: ITaskFilter
  onFilterChange: (filterType: 'clear' | 'priority' | 'status', value?: string) => void
  activeFiltersCount: number
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  const handleFilterChange = (filterType: 'clear' | 'priority' | 'status', value?: string) => {
    onFilterChange(filterType, value)
    setShowFilterDropdown(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef && filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='relative' ref={filterDropdownRef}>
      <button
        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
        className='flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors'
      >
        <Filter className='w-4 h-4 text-gray-600' />
        <span className='text-gray-700 font-medium'>Filter</span>
        {activeFiltersCount > 0 && (
          <span className='bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>{activeFiltersCount}</span>
        )}
        <ChevronDown className='w-4 h-4 text-gray-400' />
      </button>

      {showFilterDropdown && (
        <div className='absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-3 z-50'>
          <div className='px-4 py-2 border-b border-gray-100'>
            <h4 className='font-medium text-gray-900'>Filter Tasks</h4>
          </div>

          <div className='px-4 py-3'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Priority</label>
            <div className='space-y-2'>
              {['All', 'High', 'Medium', 'Low'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => handleFilterChange('priority', priority)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.priority === priority ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {priority} {priority !== 'All' && 'Priority'}
                </button>
              ))}
            </div>
          </div>

          <div className='px-4 py-3 border-t border-gray-100'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Status</label>
            <div className='space-y-2'>
              {[
                { value: 'All', label: 'All Tasks' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Completed', label: 'Completed' },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleFilterChange('status', status.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.status === status.value ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className='px-4 py-3 border-t border-gray-100'>
              <button
                onClick={() => handleFilterChange('clear')}
                className='w-full text-center py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors'
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
