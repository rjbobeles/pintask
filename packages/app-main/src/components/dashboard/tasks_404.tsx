import { Filter } from 'lucide-react'

export const NoTasks = ({ hasFilters, onClearFilters }: { hasFilters: boolean; onClearFilters: () => void }) => {
  return (
    <div className='col-span-full text-center py-12'>
      <div className='text-gray-400 mb-4'>
        <Filter className='w-12 h-12 mx-auto' />
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-2'>No tasks found</h3>
      <p className='text-gray-600'>{hasFilters ? 'Try adjusting your filters or create a new task.' : 'Create your first task to get started!'}</p>
      {hasFilters && (
        <button onClick={onClearFilters} className='mt-4 text-blue-600 hover:text-blue-700 font-medium'>
          Clear Filters
        </button>
      )}
    </div>
  )
}
