export interface ITaskData {
  title: string
  description?: string
  completed?: boolean
  priority: 'Low' | 'Medium' | 'High'
  due_date?: Date | null
  completed_at?: Date | null
}

export interface ITask {
  _id: string
  _userId: string
  data: ITaskData
  created_at: Date
  updated_at: Date
}
