import { useCallback, useEffect, useState } from 'react'

import { useDeviceContext } from '../contexts/deviceContext'
import { useUserAuthentication } from '../contexts/userAuthentication'
import { axiosClient, setupTokenRefreshInterceptor } from '../services/Axios'
import { ITask } from '../types/Task'

interface CreateTaskPayload {
  title: string
  description?: string
  priority?: 'Low' | 'Medium' | 'High'
  due_date?: string // ISO 8601 date string
}

interface UpdateTaskPayload {
  title?: string
  description?: string
  completed?: boolean
  priority?: 'Low' | 'Medium' | 'High'
  due_date?: string // ISO 8601 date string
  completed_at?: string // ISO 8601 date string
}

interface ListTasksParams {
  skip?: number
  limit?: number
  due_date?: string // ISO 8601 date string
  completed?: boolean
  priority?: ('Low' | 'Medium' | 'High')[]
}
export const useUserTaskData = () => {
  const { deviceId } = useDeviceContext()
  const { accessToken, refreshToken, refreshTokens, logout } = useUserAuthentication()

  const [taskCount, setTaskCount] = useState<number>(0)
  const [tasks, setTasks] = useState<ITask[]>([])
  const [hasMoreTasks, setHasMoreTasks] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)

  useEffect(() => {
    setupTokenRefreshInterceptor(
      () => accessToken,
      () => refreshToken,
      () => deviceId,
      refreshTokens,
      logout,
    )
  }, [accessToken, refreshToken, deviceId, refreshTokens, logout])

  useEffect(() => {
    if (tasks.length < taskCount) {
      setHasMoreTasks(true)
    } else {
      setHasMoreTasks(false)
    }
  }, [tasks, taskCount])

  const listTasks = useCallback(async (params?: ListTasksParams, append = false): Promise<{ count: number; tasks: ITask[] }> => {
    try {
      setIsLoadingTasks(true)

      const queryParams = new URLSearchParams()

      if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString())
      if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString())
      if (params?.due_date) queryParams.append('due_date', params.due_date)
      if (params?.completed !== undefined) queryParams.append('completed', params.completed.toString())
      if (params?.priority && params.priority.length > 0) {
        params.priority.forEach((p) => queryParams.append('priority', p))
      }
      queryParams.append('_', Date.now().toString())

      const response = await axiosClient.get(`/api/task?${queryParams.toString()}`)

      const { count, tasks: fetchedTasks } = response.data.data
      setTaskCount(count)

      if (append) {
        setTasks((prev) => [...prev, ...fetchedTasks])
      } else {
        setTasks(fetchedTasks)
      }

      return response.data.data
    } catch (error) {
      console.error('Error listing tasks:', error)
      return { count: 0, tasks: [] }
    } finally {
      setIsLoadingTasks(false)
    }
  }, [])

  const loadMoreTasks = useCallback(
    async (params?: Omit<ListTasksParams, 'skip'>): Promise<void> => {
      const currentSkip = tasks.length
      const loadMoreParams = { ...params, skip: currentSkip }

      await listTasks(loadMoreParams, true) // append = true
    },
    [tasks.length, listTasks],
  )

  const createTask = useCallback(async (payload: CreateTaskPayload): Promise<ITask> => {
    try {
      const response = await axiosClient.post('/api/task', payload)

      const newTask = response.data.data
      setTasks((prev) => [newTask, ...prev])
      setTaskCount((prev) => prev + 1)

      return newTask
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }, [])

  const deleteTask = useCallback(async (task_id: string): Promise<void> => {
    try {
      await axiosClient.delete(`/api/task/${task_id}`)

      setTasks((prev) => prev.filter((task) => task._id !== task_id))
      setTaskCount((prev) => prev - 1)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }, [])

  const findTask = useCallback(async (task_id: string): Promise<ITask> => {
    try {
      const response = await axiosClient.get(`/api/task/${task_id}`)

      return response.data.data
    } catch (error) {
      console.error('Error finding task:', error)
      throw error
    }
  }, [])

  const updateTask = useCallback(
    async (task_id: string, payload: UpdateTaskPayload): Promise<void> => {
      try {
        await axiosClient.patch(`/api/task/${task_id}`, payload)

        const updatedTask = await findTask(task_id)
        setTasks((prev) => prev.map((task) => (task._id === task_id ? updatedTask : task)))
      } catch (error) {
        console.error('Error updating task:', error)
        throw error
      }
    },
    [findTask],
  )

  useEffect(() => {
    if (!initialized && accessToken) {
      listTasks({ skip: 0, limit: 12 }).finally(() => setInitialized(true))
    }
  }, [initialized, accessToken, listTasks])

  return {
    taskCount,
    tasks,
    createTask,
    deleteTask,
    findTask,
    listTasks,
    updateTask,
    hasMoreTasks,
    isLoadingTasks,
    loadMoreTasks,
  }
}
