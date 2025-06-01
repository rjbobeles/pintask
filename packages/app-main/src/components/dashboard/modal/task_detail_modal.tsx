import { Calendar, Check, CheckCheck, Edit3, Flag, Trash2, X } from 'lucide-react'

import { getPriorityColor } from '../../../helpers/getPriorityColor'
import { ITask } from '../../../types/Task'

export const TaskDetailModal = ({
  task,
  deleteTask,
  closeModal,
  editTask,
  completeTask,
}: {
  task: ITask | null
  deleteTask: (taskId: string) => void
  editTask: (task: ITask) => void
  closeModal: () => void
  completeTask: (taskId: string) => void
}) => {
  if (!task) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-2xl max-w-md w-full p-6'>
        <div className='flex justify-between items-start mb-4'>
          <h3 className='text-xl font-bold text-gray-900'>{task.data.title}</h3>
          <button onClick={closeModal} className='text-gray-400 hover:text-gray-600'>
            <X className='w-6 h-6' />
          </button>
        </div>

        <div className='space-y-4'>
          <p className='text-gray-700'>{task.data.description}</p>

          <div className='flex items-center gap-2'>
            <Flag className='w-4 h-4 text-gray-500' />
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.data.priority)}`}>
              {task.data.priority} Priority
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <Calendar className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-600'>Due: {task.data.due_date?.toString().split('T')[0] || '-'}</span>
          </div>

          {task.data.completed && (
            <div className='flex items-center gap-2'>
              <CheckCheck className='w-4 h-4 text-gray-500' />
              <span className='text-sm text-gray-600'>Completed At: {task.data.completed_at?.toString().split('T')[0] || '-'}</span>
            </div>
          )}

          <div className='flex gap-2 pt-4'>
            <button
              onClick={() => completeTask(task._id)}
              disabled={task.data.completed}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                task.data.completed ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Check className='w-4 h-4 inline mr-2' />
              {task.data.completed ? 'Completed' : 'Mark Complete'}
            </button>

            <button onClick={() => editTask(task)} className='px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors'>
              <Edit3 className='w-4 h-4' />
            </button>

            <button onClick={() => deleteTask(task._id)} className='px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors'>
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
