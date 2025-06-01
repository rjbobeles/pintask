import { Check } from 'lucide-react'

import { getPriorityColor } from '../../helpers/getPriorityColor'
import { ITask } from '../../types/Task'

export const TaskCard = ({ task, onTaskClick }: { task: ITask; onTaskClick: (task: ITask) => void }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 ${
        task.data.completed
          ? 'border-green-400 opacity-75'
          : task.data.priority === 'High'
          ? 'border-red-400'
          : task.data.priority === 'Medium'
          ? 'border-yellow-400'
          : 'border-blue-400'
      }`}
      onClick={() => onTaskClick(task)}
    >
      <div className='flex justify-between items-start mb-3'>
        <h3 className={`font-bold text-gray-900 ${task.data.completed ? 'line-through' : ''}`}>{task.data.title}</h3>
        {task.data.completed && (
          <div className='bg-green-100 rounded-full p-1'>
            <Check className='w-4 h-4 text-green-600' />
          </div>
        )}
      </div>

      <p className={`text-gray-600 text-sm mb-4 line-clamp-3 ${task.data.completed ? 'line-through' : ''}`}>
        {task.data.description ? (task.data.description.length > 26 ? task.data.description.slice(0, 23) + '...' : task.data.description) : ''}
      </p>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.data.priority)}`}>{task.data.priority}</span>
          <span className='text-xs text-gray-500'>{task.data.due_date?.toString().split('T')[0] || ''}</span>
        </div>
      </div>
    </div>
  )
}
