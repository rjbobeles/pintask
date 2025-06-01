import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { NavBar } from '../components/dashboard/header'
import { TaskDetailModal } from '../components/dashboard/modal/task_detail_modal'
import { TaskFormModal } from '../components/dashboard/modal/task_form_modal'
import { TaskCard } from '../components/dashboard/task_card'
import { TaskFilters } from '../components/dashboard/task_filter'
import { NoTasks } from '../components/dashboard/tasks_404'
import { useUserAuthentication } from '../contexts/userAuthentication'
import { useUserTaskData } from '../hooks/useUserTaskData'
import { ITask } from '../types/Task'
import { ITaskFilter } from '../types/TaskFilters'

export const Tasks = () => {
  const { isAuthenticated } = useUserAuthentication()

  const navigate = useNavigate()
  const location = useLocation()

  // Modals
  const [showTaskDetailModal, setShowTaskDetailModal] = useState<boolean>(false)
  const [showTaskFormModal, setShowTaskFormModal] = useState<boolean>(false)

  // Functionality
  const [filters, setFilters] = useState<ITaskFilter>({ priority: 'All', status: 'All' })
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null)
  const [editingTask, setEditingTask] = useState<ITask | null>(null)

  // Data
  const { tasks, deleteTask, listTasks, updateTask, createTask, hasMoreTasks, isLoadingTasks, loadMoreTasks, taskCount } = useUserTaskData()

  // Event Handlers
  const handleFilterChange = (filterType: 'clear' | 'priority' | 'status', value?: string) => {
    if (filterType === 'clear') setFilters({ priority: 'All', status: 'All' })
    else setFilters((prev) => ({ ...prev, [filterType]: value ?? 'All' }))
  }

  // Utility functions
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.priority !== 'All') count++
    if (filters.status !== 'All') count++
    return count
  }

  // Effects
  useEffect(() => {
    if (!isAuthenticated) navigate('/auth/sign_in', { state: { from: location }, replace: true })
  }, [isAuthenticated, location, navigate])

  useEffect(() => {
    if (!isAuthenticated) return

    listTasks({
      priority: filters.priority !== 'All' ? [filters.priority as never] : undefined,
      completed: filters.status !== 'All' ? (filters.status === 'Pending' ? false : true) : undefined,
    })
  }, [filters, listTasks, isAuthenticated])

  const handleTaskSubmit = async (data: never) => {
    if (editingTask) await updateTask(editingTask._id, data)
    else await createTask(data)

    setEditingTask(null)
    setShowTaskFormModal(false)
  }

  return (
    <>
      {/* Main Sections */}
      <div className='min-h-screen bg-gray-50'>
        <NavBar />

        <div className='max-w-6xl mx-auto px-4 py-8'>
          <div className='flex justify-between items-center mb-8'>
            <button
              onClick={() => {
                setEditingTask(null)
                setShowTaskFormModal(true)
              }}
              className='bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2'
            >
              <Plus className='w-5 h-5' />
              Add New Task
            </button>

            <TaskFilters filters={filters} onFilterChange={handleFilterChange} activeFiltersCount={getActiveFiltersCount()} />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {tasks.length === 0 ? (
              <NoTasks hasFilters={getActiveFiltersCount() > 0} onClearFilters={() => handleFilterChange('clear')} />
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onTaskClick={(task: ITask) => {
                    setSelectedTask(task)
                    setShowTaskDetailModal(true)
                  }}
                />
              ))
            )}
          </div>

          {/* Load More Button */}
          {hasMoreTasks && (
            <div className='text-center mt-8'>
              <button
                onClick={async () => {
                  await loadMoreTasks({
                    limit: 12,
                    priority: filters.priority !== 'All' ? [filters.priority as 'Low' | 'Medium' | 'High'] : undefined,
                    completed: filters.status !== 'All' ? (filters.status === 'Pending' ? false : true) : undefined,
                  })
                }}
                disabled={isLoadingTasks}
                className='bg-blue-600 text-white py-3 px-8 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto'
              >
                {isLoadingTasks ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Plus className='w-4 h-4' />
                    Load More Tasks ({taskCount - tasks.length} remaining)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showTaskDetailModal && (
        <TaskDetailModal
          task={selectedTask}
          closeModal={() => setShowTaskDetailModal(false)}
          deleteTask={async (taskId: string) => {
            await deleteTask(taskId)
            setShowTaskDetailModal(false)
          }}
          completeTask={async (taskId: string) => {
            await updateTask(taskId, { completed: true, completed_at: new Date().toISOString() })

            setEditingTask(null)
            setShowTaskDetailModal(false)
          }}
          editTask={(task: ITask) => {
            setEditingTask(task)
            setShowTaskDetailModal(false)
            setShowTaskFormModal(true)
          }}
        />
      )}

      {showTaskFormModal && (
        <TaskFormModal
          task={editingTask}
          isOpen={showTaskFormModal}
          onClose={() => {
            setShowTaskFormModal(false)
            setEditingTask(null)
          }}
          onSubmit={handleTaskSubmit}
        />
      )}
    </>
  )
}
