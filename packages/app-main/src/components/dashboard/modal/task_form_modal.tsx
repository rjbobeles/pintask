import { ChevronDown, X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { ITask } from '../../../types/Task'

interface CreateTaskFormData {
  title: string
  description?: string
  priority?: string
  dueDate?: string
}

export const TaskFormModal = ({
  task,
  isOpen,
  onClose,
  onSubmit,
}: {
  task: ITask | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: never) => Promise<void>
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CreateTaskFormData>({
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: undefined,
      priority: 'Medium',
      dueDate: undefined,
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setValue('title', task.data.title || '')
        setValue('description', task.data.description || '')
        setValue('priority', task.data.priority || 'Medium')

        if (task.data.due_date) {
          const date = new Date(task.data.due_date)
          if (!isNaN(date.getTime())) {
            const formattedDate = date.toISOString().split('T')[0]
            setValue('dueDate', formattedDate)
          }
        }
      } else {
        reset({
          title: '',
          description: '',
          priority: 'Medium',
          dueDate: undefined,
        })
      }
    }
  }, [isOpen, task, setValue, reset])

  const onFormSubmit = async (data: CreateTaskFormData) => {
    try {
      await onSubmit({
        title: data.title.trim(),
        description: data.description?.trim() || '',
        priority: data.priority,
        due_date: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      } as never)
      onClose()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-2xl max-w-lg w-full p-6'>
        <div className='flex justify-between items-start mb-6'>
          <h3 className='text-xl font-bold text-gray-900'>{task ? 'Edit Task' : 'Add New Task'}</h3>
          <button onClick={handleClose} className='text-gray-400 hover:text-gray-600'>
            <X className='w-6 h-6' />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
          {/* Title Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Task Title <span className='text-red-600'>*</span>
            </label>
            <input
              type='text'
              {...register('title', {
                required: 'Title cannot be empty',
                maxLength: {
                  value: 255,
                  message: 'Title cannot exceed 255 characters',
                },
                validate: (value) => {
                  const trimmed = value.trim()
                  if (!trimmed) return 'Title cannot be empty'
                  return true
                },
              })}
              placeholder='Enter task title'
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className='mt-1 text-sm text-red-600'>{errors.title.message}</p>}
          </div>

          {/* Description Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
            <textarea
              {...register('description', {
                maxLength: {
                  value: 1000,
                  message: 'Description cannot exceed 1000 characters',
                },
              })}
              placeholder='Enter task description'
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className='mt-1 text-sm text-red-600'>{errors.description.message}</p>}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {/* Priority Field */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Priority</label>
              <div className='relative'>
                <select
                  {...register('priority', {
                    validate: (value) => {
                      if (value && !['Low', 'Medium', 'High'].includes(value)) {
                        return 'Priority must be one of: Low, Medium, High'
                      }
                      return true
                    },
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                    errors.priority ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value='Low'>Low Priority</option>
                  <option value='Medium'>Medium Priority</option>
                  <option value='High'>High Priority</option>
                </select>
                <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none'>
                  <ChevronDown className='w-4 h-4 text-gray-400' />
                </div>
              </div>
              {errors.priority && <p className='mt-1 text-sm text-red-600'>{errors.priority.message}</p>}
            </div>

            {/* Due Date Field */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Due Date</label>
              <input
                type='date'
                {...register('dueDate', {
                  validate: (value) => {
                    if (value && !Date.parse(value)) {
                      return 'Due date must be a valid date'
                    }
                    return true
                  },
                })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && <p className='mt-1 text-sm text-red-600'>{errors.dueDate.message}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4'>
            <button
              type='submit'
              disabled={isSubmitting}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${
                isSubmitting ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Add Task'}
            </button>

            <button
              type='button'
              onClick={handleClose}
              disabled={isSubmitting}
              className='px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
